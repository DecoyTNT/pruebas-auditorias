const express = require('express')

const {
    verificaToken,
    verificaAdmin,
    verificaAdminAuditorLider,
    verificaAdminAuditorLiderDir,
    verificaAuditor,
    verificaAuditorLider,
    verificaAltaDir
} = require('../middlewares/autenticacion')

const Auditado = require('../models/auditado')

const app = express()

app.get('/personal', (req, res) => {
    Auditado.find()
        .populate('informe')
        .exec((err, auditados) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                })
            }

            Auditado.count((err, conteo) => {
                res.json({
                    ok: true,
                    auditados,
                    cuantos: conteo
                })
            })
        })
})

app.get('/personal/informe/:id', (req, res) => {
    let id = req.params.id
    Auditado.find({ informe: id })
        .populate('informe')
        .exec((err, auditados) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                })
            }

            Auditado.count({ informe: id }, (err, conteo) => {
                res.json({
                    ok: true,
                    auditados,
                    cuantos: conteo
                })
            })
        })
})

app.post('/personal', (req, res) => {
    let body = req.body

    let auditado = new Auditado({
        informe: body.informe,
        nombre: body.nombre,
        puesto: body.puesto
    })

    auditado.save((err, auditadoDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            auditado: auditadoDB
        })
    })
})

app.delete('/personal/:id', (req, res) => {
    let id = req.params.id

    Auditado.findByIdAndRemove(id, (err, auditadoBorrado) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            })
        }

        if (!auditadoBorrado) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontro ese auditado'
                }
            })
        }

        res.json({
            ok: true,
            auditado: auditadoDB
        })
    })
})

module.exports = app