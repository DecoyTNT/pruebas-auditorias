const express = require('express')

const _ = require('underscore')

const {
    verificaToken,
    verificaAdmin,
    verificaAuditor,
    verificaAuditorLider,
    verificaAltaDir
} = require('../middlewares/autenticacion')

const Verificacion = require('../models/verificacion')
const Planeacion = require('../models/planeacion')
const Usuario = require('../models/usuario')

const app = express()

// Obtiene todas las verificaciones
app.get('/verificacion', (req, res) => {
    Verificacion.find({ estado: true })
        .exec((err, verificaciones) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            Verificacion.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    verificaciones,
                    cuantos: conteo
                })
            })
        })
})

// Obtener una verificacion por id 
app.get('/verificacion/:id', (req, res) => {
    let id = req.body.id
    Verificacion.findById(id)
        .exec((err, verificacionDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!verificacionDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se encontro la verificación'
                    }
                })
            }

            res.json({
                ok: true,
                verificacion: verificacionDB
            })
        })
})

// Obtener las verificaciones por planeación 
app.get('/verificacion/planeacion/:id', (req, res) => {
    let planeacionid = req.params.id

    Planeacion.findById(planeacionid)
        .exec((err, planeacionDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!planeacionDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se encontro la planeación'
                    }
                })
            }
            Verificacion.find({ planeacion: planeacionid, estado: true })
                .exec((err, verificaciones) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        })
                    }

                    Verificacion.count({ planeacion: planeacionid, estado: true }, (err, conteo) => {
                        res.json({
                            ok: true,
                            verificaciones,
                            cuantos: conteo
                        })
                    })
                })
        })
})

app.get('/verificacion/planeacion/enviar/:id', (req, res) => {
    let planeacionid = req.params.id

    Verificacion.find({ planeacion: planeacionid, estado: true, enviar: true })
        .exec((err, verificaciones) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            Verificacion.count({ planeacion: planeacionid, estado: true, enviar: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    verificaciones,
                    cuantos: conteo
                })
            })
        })

})

// Obtener las verificaciones por usuario 
app.get('/verificacion/usuario/:id', (req, res) => {
    let usuarioid = req.params.id

    Usurio.findById(usuarioid)
        .exec((err, usuarioDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!usuarioDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se encontro el usuario'
                    }
                })
            }
            Verificacion.find({ auditor: usuarioid, estado: true })
                .exec((err, verificaciones) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        })
                    }

                    Verificacion.count({ auditor: usuarioid, estado: true }, (err, conteo) => {
                        res.json({
                            ok: true,
                            verificaciones,
                            cuantos: conteo
                        })
                    })
                })
        })
})

// Obtener las verificaciones por planeación y auditor 
app.get('/verificacion/planeacion/usuario/:id/:iduser', (req, res) => {
    let planeacionid = req.params.id
    let usuarioid = req.params.iduser

    Verificacion.find({ planeacion: planeacionid, auditor: usuarioid, estado: true })
        .exec((err, verificaciones) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!verificaciones) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se encontro ninguna verificacion para esa planeación o auditor'
                    }
                })
            }

            Verificacion.count({ planeacion: planeacionid, auditor: usuarioid, estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    verificaciones,
                    cuantos: conteo
                })
            })
        })

})

// Obtener las verificaciones enviadas por planeación y auditor 
app.get('/verificacion/planeacion/usuario/enviar/:id/:iduser', (req, res) => {
    let planeacionid = req.params.id
    let usuarioid = req.params.iduser

    Verificacion.find({ planeacion: planeacionid, auditor: usuarioid, estado: true, enviar: true })
        .exec((err, verificaciones) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!verificaciones) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se encontro ninguna verificacion para esa planeación o auditor'
                    }
                })
            }

            Verificacion.count({ planeacion: planeacionid, auditor: usuarioid, estado: true, enviar: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    verificaciones,
                    cuantos: conteo
                })
            })
        })

})

// Crear una verificacion
app.post('/verificacion', (req, res) => {
    let body = req.body

    let verificacion = new Verificacion({
        auditor: body.auditor,
        planeacion: body.planeacion,
        puntoNorma: body.puntoNorma,
        pregunta: body.pregunta,
        documento: body.documento,
        evidencia: body.evidencia,
        hallazgos: body.hallazgos
    })

    Planeacion.findOne({ auditores: body.auditor, _id: body.planeacion }, (err, planeacionDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!planeacionDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No es posible crear esta lista de verificacion'
                }
            })
        }

        verificacion.save((err, verificacionDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                verificacionDB
            })
        })
    })
})

// Modifica el punto y la pregunta de la verificación por id
app.put('/verificacion/punto/:id', (req, res) => {
    let id = req.params.id
    let body = _.pick(req.body, ['puntoNorma', 'pregunta', 'enviar', 'valido'])
    body.enviar = false
    body.valido = false

    Verificacion.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, verificacionDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!verificacionDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontro la verificación'
                }
            })
        }

        res.json({
            ok: true,
            verificacionDB
        })
    })
})

app.put('/verificacion/documento/:id', (req, res) => {
    let id = req.params.id
    let body = _.pick(req.body, ['documento', 'evidencia', 'hallazgos'])

    Verificacion.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, verificacionDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!verificacionDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontro la verificación'
                }
            })
        }

        res.json({
            ok: true,
            verificacionDB
        })
    })
})

// Envia todas las planeaciones
app.put('/verificacion/planeacion/:id', (req, res) => {
    let planeacionid = req.params.id

    Verificacion.update({ planeacion: planeacionid }, { enviar: true }, { multi: true }, (err, verificacionDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!verificacionDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontro una planeacion con ese id'
                }
            })
        }

        res.json({
            ok: true,
            verificacion: verificacionDB
        })

    })
})

// Valida todas las planeaciones
app.put('/verificacion/planeacion/validar/:id', (req, res) => {
    let planeacionid = req.params.id

    Verificacion.update({ planeacion: planeacionid }, { valido: true }, { multi: true }, (err, verificacionDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!verificacionDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontro una planeacion con ese id'
                }
            })
        }

        res.json({
            ok: true,
            verificacion: verificacionDB
        })

    })
})

// Eliminar Verificacion
app.delete('/verificacion/:id', (req, res) => {
    let id = req.params.id
    let cambiaEstado = {
        estado: false
    }

    Verificacion.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, verificacionBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!verificacionBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontro la planeacion'
                }
            })
        }

        res.json({
            ok: true,
            verificacion: verificacionBorrada
        })
    })
})


module.exports = app;