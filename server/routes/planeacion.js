const express = require('express')

const {
    verificaToken,
    verificaAdmin,
    verificaAdminAuditorLider,
    verificaAuditor,
    verificaAuditorLider,
    verificaAltaDir
} = require('../middlewares/autenticacion')

const Planeacion = require('../models/planeacion')
const Auditoria = require('../models/auditoria')
const Usuario = require('../models/usuario')

const app = express()

// Obtener todas las planeaciones
app.get('/planeacion', [verificaToken], (req, res) => {

    Planeacion.find({ estado: true })
        .populate('auditoria')
        .populate('proceso')
        .populate('auditores')
        .sort('fecha')
        .sort('horario')
        .exec((err, planeaciones) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            Planeacion.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    planeaciones,
                    cuantos: conteo
                })
            })
        })
})

// Obtener todas las planeaciones
app.get('/planeacion/:id', [verificaToken], (req, res) => {
    let id = req.params.id

    Planeacion.findById(id)
        .populate('auditoria')
        .populate('proceso')
        .populate('auditores')
        .sort('fecha')
        .sort('horario')
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
                        message: 'No se encontró la planeación'
                    }
                })
            }
            res.json({
                ok: true,
                planeacion: planeacionDB,
            })

        })
})

// Obtiene las planeaciones de una auditoría por id
app.get('/planeacion/auditoria/:id', [verificaToken], (req, res) => {
    let auditoriaid = req.params.id

    Auditoria.findById(auditoriaid)
        .exec((err, auditoriaDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!auditoriaDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se encontro la auditoria'
                    }
                })
            }

            Planeacion.find({ auditoria: auditoriaid, estado: true })
                .populate('auditoria')
                .populate('proceso')
                .populate('auditores')
                .sort('fecha')
                .sort('horario')
                .exec((err, planeaciones) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        })
                    }

                    Planeacion.count({ auditoria: auditoriaid, estado: true }, (err, conteo) => {
                        res.json({
                            ok: true,
                            planeaciones,
                            cuantos: conteo
                        })
                    })

                })

        })
})

// Obtiene los auditores de una planeacion de una auditoría por id
app.get('/planeacion/auditoria/usuario/:id', [verificaToken], (req, res) => {
    let auditoriaid = req.params.id
    let usuario = req.usuario

    Planeacion.find({ auditores: usuario._id, auditoria: auditoriaid, estado: true })
        .populate('auditoria')
        .populate('proceso')
        .populate('auditores')
        .sort('fecha')
        .sort('horario')
        .exec((err, planeaciones) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            Planeacion.count({ auditores: usuario._id, auditoria: auditoriaid, estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    planeaciones,
                    cuantos: conteo
                })
            })
        })
})

// Obtiene las planeaciones que han sido enviadas de una auditoría por id
app.get('/planeacion/auditoria/enviar/:id', [verificaToken], (req, res) => {
    let auditoriaid = req.params.id

    Auditoria.findById(auditoriaid)
        .exec((err, auditoriaDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!auditoriaDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se encontro la auditoria'
                    }
                })
            }

            Planeacion.find({ auditoria: auditoriaid, estado: true, enviar: true })
                .populate('auditoria')
                .populate('proceso')
                .populate('auditores')
                .sort('fecha')
                .sort('horario')
                .exec((err, planeaciones) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        })
                    }

                    Planeacion.count({ auditoria: auditoriaid, estado: true, enviar: true }, (err, conteo) => {
                        res.json({
                            ok: true,
                            planeaciones,
                            cuantos: conteo
                        })
                    })

                })

        })
})

// Crear una planeacion
app.post('/planeacion', [verificaToken, verificaAdminAuditorLider], (req, res) => {
    let body = req.body
    let cambiaValido = {
        valido: false
    }

    let planeacion = new Planeacion({
        auditoria: body.auditoria,
        fecha: body.fecha,
        horario: body.horario,
        proceso: body.proceso,
        actividad: body.actividad,
        criterio: body.criterio,
        auditores: body.auditores,
        participantes: body.participantes,
        contacto: body.contacto,
        area: body.area
    })

    planeacion.save({ $set: { auditores: body.auditores } }, (err, planeacionDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        Auditoria.findByIdAndUpdate(body.auditoria, cambiaValido, { new: true }, (err, auditoriaDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!auditoriaDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "No se encontro la auditoría"
                    }
                })
            }
        })

        res.json({
            ok: true,
            planeacion: planeacionDB
        })
    })
})

// Actualizar una Planeacion
app.put('/planeacion/:id', [verificaToken, verificaAdminAuditorLider], (req, res) => {
    let id = req.params.id
    let body = req.body
    body.enviar = false
    let cambiaValido = {
        valido: false
    }

    Planeacion.findByIdAndUpdate(id, body, { $set: { auditores: body.auditores } }, (err, planeacionDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!planeacionDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontro la planeacion'
                }
            })
        }

        Auditoria.findByIdAndUpdate(body.auditoria, cambiaValido, { new: true }, (err, auditoriaDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!auditoriaDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se encontro la auditoría'
                    }
                })
            }
        })

        res.json({
            ok: true,
            planeacion: planeacionDB
        })
    })

})

// Enviar planeaciones por id de auditoria
app.put('/planeacion/auditoria/:id', [verificaToken, verificaAdminAuditorLider], (req, res) => {
    let auditoriaid = req.params.id
    let cambiaValido = {
        valido: false
    }

    Planeacion.update({ auditoria: auditoriaid }, { enviar: true }, { multi: true }, (err, planeacionDB) => {
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
        Auditoria.findByIdAndUpdate(auditoriaid, cambiaValido, { new: true }, (err, auditoriaDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!auditoriaDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se encontro la auditoría'
                    }
                })
            }
        })
        res.json({
            ok: true,
            planeacion: planeacionDB
        })

    })

})

// Eliminar planeacion
app.delete('/planeacion/:id', [verificaToken, verificaAdminAuditorLider], (req, res) => {
    let id = req.params.id
    let body = req.body
    let cambiaEstado = {
        estado: false
    }
    let cambiaValido = {
        valido: false
    }

    Planeacion.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, planeacionBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!planeacionBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontro la planeación'
                }
            })
        }

        Auditoria.findByIdAndUpdate(planeacionBorrada.auditoria, cambiaValido, { new: true }, (err, auditoriaDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!auditoriaDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se encontro la auditoría'
                    }
                })
            }
        })

        res.json({
            ok: true,
            planeacion: planeacionBorrada
        })
    })
})




module.exports = app;