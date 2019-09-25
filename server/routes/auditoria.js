const express = require('express')

const { verificaToken, verificaAdmin, verificaAuditado, verificaAuditor, verificaAuditorLider, verificaAltaDir, } = require('../middlewares/autenticacion')

const Auditoria = require('../models/auditoria')

const app = express()

// Obtiene las auditorias
app.get('/auditoria', (req, res) => {

    // let desde = req.query.desde || 0
    // desde = Number(desde)

    // let limite = req.query.limite || 5
    // limite = Number(limite)

    Auditoria.find()
        // .skip(desde)
        // .limit(limite)
        .populate('normas', 'nombreNorma')
        .populate('grupoAuditor', 'nombre')
        .populate('auditados', 'nombre')
        .populate('plan', 'nombrePlan')
        .exec((err, auditorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            Auditoria.count((err, conteo) => {
                res.json({
                    ok: true,
                    auditorias,
                    cuantos: conteo
                })
            })

        })

})

// Obtiene una auditoria por id
app.get('/auditoria/:id', (req, res) => {
    var auditoriaid = req.params.id

    Auditoria.findById(auditoriaid)
        .populate('normas', 'nombreNorma')
        .populate('grupoAuditor', 'nombre', 'primer_Apellido')
        .populate('auditados', 'nombre', 'primer_Apellido')
        .exec((err, auditoriaDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                auditoria: auditoriaDB
            })

        })
})

// Obtiene una auditoria por periodo
app.get('/auditoria/periodo/:periodo', (req, res) => {
    var auditoriaPeriodo = req.params.periodo

    Auditoria.find({ periodo: auditoriaPeriodo })
        .populate('normas', 'nombreNorma')
        .populate('grupoAuditor', 'nombre')
        .populate('auditados', 'nombre')
        .exec((err, auditoriaDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                auditoria: auditoriaDB
            })

        })
})

// Obtiene los periodos de una auditoria
app.get('/auditoria/periodos/todos', (req, res) => {

    Auditoria.find()
        .populate('normas', 'nombreNorma')
        .populate('grupoAuditor', 'nombre')
        .populate('auditados', 'nombre')
        .exec((err, auditoriaDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                auditoria: auditoriaDB
            })

        })
})

// Crea una auditoria
app.post('/auditoria', (req, res) => {
    let body = req.body

    let auditoria = new Auditoria({
        nombreAuditoria: body.nombreAuditoria,
        normas: body.norma,
        fechaInicial: body.fechaInicial,
        fechaFinal: body.fechaFinal,
        plan: body.plan,
        grupoAuditor: body.grupoAuditor,
        auditados: body.auditados,
        objetivos: body.objetivos,
        alcance: body.alcance,
        contacto: body.contacto
    })

    auditoria.save({ $set: { normas: body.norma, grupoAuditor: body.grupoAuditor, auditados: body.auditados } }, (err, auditoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            auditoria: auditoriaDB
        })
    })


})

// Actualiza la auditoria
app.put('/auditoria/:id', (req, res) => {
    let id = req.params.id
    let body = req.body

    Auditoria.findByIdAndUpdate(id, { $set: { normas: body.norma, grupoAuditor: body.grupoAuditor, auditados: body.auditados } }, (err, auditoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!auditoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            auditoria: auditoriaDB
        })

    })
})

app.delete('/auditoria/:id', (req, res) => {
    let id = req.params.id
    Auditoria.findByIdAndRemove(id, (err, auditoriaBorrada) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!auditoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Auditoria no encontrada'
                }
            })
        }

        res.json({
            ok: true,
            auditoria: auditoriaBorrada
        })
    })
})

module.exports = app;