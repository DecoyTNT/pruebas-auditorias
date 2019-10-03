const express = require('express')

const {
    verificaToken,
    verificaAdmin,
    verificaAuditado,
    verificaAuditor,
    verificaAuditorLider,
    verificaAltaDir
} = require('../middlewares/autenticacion')

const Verificacion = require('../models/verificacion')
const Auditoria = require('../models/auditoria')
const Usuario = require('../models/usuario')

const app = express()

// Obtiene todas las verificaciones
app.get('/verificacion', (req, res) => {
    Verificacion.find()
        .exec((err, verificaciones) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            Verificacion.count((err, conteo) => {
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

// Obtener las verificaciones por auditoria 
app.get('/verificacion/auditoria/:id', (req, res) => {
    let auditoriaid = req.body.id

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
            Verificacion.find({ auditoria: auditoriaid })
                .exec((err, verificaciones) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        })
                    }

                    Verificacion.count({ auditoria: auditoriaid }, (err, conteo) => {
                        res.json({
                            ok: true,
                            verificaciones,
                            cuantos: conteo
                        })
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
            Verificacion.find({ auditor: usuarioid })
                .exec((err, verificaciones) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        })
                    }

                    Verificacion.count({ auditoria: auditoriaid }, (err, conteo) => {
                        res.json({
                            ok: true,
                            verificaciones,
                            cuantos: conteo
                        })
                    })
                })
        })
})

// Obtener las verificaciones por auditoria y auditor 
app.get('/verificacion/auditoria/usuario/:idAuditoria/:idUsuario', (req, res) => {
    let auditoriaid = req.params.idAuditoria
    let auditorid = req.params.idUsuario

    Verificacion.find({ auditoria: auditoriaid, auditor: auditorid })
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
                        message: 'No se encontro ninguna verificacion para esa auditoria o auditor'
                    }
                })
            }

            Verificacion.count({ auditoria: auditoriaid, auditor: auditorid }, (err, conteo) => {
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

    let verificaion = new Verificacion({
        auditor: body.auditor,
        auditoria: body.auditoria,
        entrevistado: body.entrevistado,
        puntoNorma: body.puntoNorma,
        pregunta: body.pregunta,
        documento: body.documento,
        evidencia: body.evidencia,
        hallazgos: body.hallazgos,
        fecha: body.fecha
    })

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




module.exports = app;