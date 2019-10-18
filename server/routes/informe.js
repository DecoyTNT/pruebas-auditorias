const express = require('express')

const _ = require('underscore')

const {
    verificaToken,
    verificaAdmin,
    verificaAuditor,
    verificaAuditorLider,
    verificaAltaDir
} = require('../middlewares/autenticacion')

const Informe = require('../models/informe')

const app = express()

app.get('/informe', (req, res) => {
    Informe.find()
        .populate('marcas')
        .sort('numero')
        .exec((err, informes) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                })
            }
            Informe.count((err, conteo) => {
                res.json({
                    ok: true,
                    informes,
                    cuantos: conteo
                })
            })
        })
})

app.post('/informe', (req, res) => {
    let body = req.body

    let informe = new Informe({
        auditoria: body.auditoria,
        proceso: body.proceso,
        fecha: body.fecha,
        oportunidadesMejora: body.oportunidadesMejora,
        comentarios: body.comentarios,
        conclusiones: body.conclusiones,
        recibiConformidad: body.recibiConformidad,
        fechaAuditorias: body.fechaAuditorias,
        fechaEmision: body.fechaEmision
    })

    informe.save({ $set: { oportunidadesMejora: body.oportunidadesMejora } }, { new: true, runValidators: true, context: 'query' }, (err, informeDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            informe: informeDB
        })
    })
})

app.put('/informe/:id', (req, res) => {
    let id = req.params.id
    let body = req.body

    Informe.findByIdAndUpdate(id, { $set: { oportunidadesMejora: body.oportunidadesMejora } }, { new: true, runValidators: true, context: 'query' }, (err, informeDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            })
        }

        if (!informeDB) {
            res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            informeDB
        })
    })
})

app.put('/informe/proceso/:id', (req, res) => {
    let id = req.params.id
    let body = _.pick(req.body, ['proceso', 'fecha'])

    Informe.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, informeDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            })
        }

        if (!informeDB) {
            res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            informeDB
        })
    })
})

app.put('/informe/oportunidades/:id', (req, res) => {
    let id = req.params.id
    let body = _.pick(req.body, ['oportunidadesMejora'])

    Informe.findByIdAndUpdate(id, { $set: { oportunidadesMejora: body.oportunidadesMejora } }, { new: true, runValidators: true, context: 'query' }, (err, informeDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            })
        }

        if (!informeDB) {
            res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            informeDB
        })
    })
})

module.exports = app