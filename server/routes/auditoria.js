const express = require('express')

const { verificaToken } = require('../middlewares/autenticacion')

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
        .populate('norma', 'nombreNorma')
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

    Auditoria.findById(auditoriaid).exec((err, auditoriaDB) => {
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
        numeroAuditoria: body.numeroAuditoria,
        norma: body.norma,
        periodo: body.periodo,
        grupoAuditor: body.grupoAuditor,
        auditados: body.auditados,
        objetivos: body.objetivos,
        alcance: body.alcance,
        contacto: body.contacto
    })

    auditoria.save((err, auditorianDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            auditoria: auditorianDB
        })
    })


})

// Actualiza la auditoria
app.put('/auditoria/:id', (req, res) => {
    let id = req.params.id
    let body = req.body

    Auditoria.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, auditoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

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