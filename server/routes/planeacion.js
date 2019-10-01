const express = require('express')

const {
    verificaToken,
    verificaAdmin,
    verificaAuditado,
    verificaAuditor,
    verificaAuditorLider,
    verificaAltaDir
} = require('../middlewares/autenticacion')

const Planeacion = require('../models/planeacion')
const Auditoria = require('../models/auditoria')

const app = express()

// Obtener todas las planeaciones
app.get('/planeacion', (req, res) => {

    Planeacion.find({ estado: true })
        .populate('auditoria')
        .populate('proceso')
        .populate('participantes')
        .populate('contacto')
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
app.get('/planeacion/:id', (req, res) => {
    let id = req.params.id

    Planeacion.findById(id)
        .populate('auditoria')
        .populate('proceso')
        .populate('participantes')
        .populate('contacto')
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
app.get('/planeacion/auditoria/:id', (req, res) => {
    var auditoriaid = req.params.id

    Auditoria.findById(auditoriaid)
        .populate('auditoria')
        .populate('proceso')
        .populate('participantes')
        .populate('contacto')
        .exec((err, planeacionDB) => {
            Planeacion.find({ auditoria: auditoriaid, estado: true })
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

// Crear una planeacion
app.post('/planeacion', (req, res) => {
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
        participantes: body.participantes,
        contacto: body.contacto,
        area: body.area
    })

    planeacion.save({ $set: { participantes: body.participantes, contacto: body.contacto, } }, (err, planeacionDB) => {
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
app.put('/planeacion/:id', (req, res) => {
    let id = req.params.id
    let body = req.body
    let cambiaValido = {
        valido: false
    }

    Planeacion.findByIdAndUpdate(id, body, { $set: { participantes: body.participantes, contacto: body.contacto, } }, (err, planeacionDB) => {
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

// Eliminar planeacion
app.delete('planeacion/:id', (req, res) => {
    let id = req.params.id
    let body = req.body
    let cambiaEstado = {
        estado: true
    }

    Planeacion.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, planeacionBorrada) => {
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
            planeacion: planeacionBorrada
        })
    })
})




module.exports = app;