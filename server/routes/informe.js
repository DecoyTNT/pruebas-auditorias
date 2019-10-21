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

app.get('/informe/auditoria/:id', (req, res) => {
    let id = req.params.id

    Informe.findOne({ auditoria: id })
        .populate('auditoria')
        .populate('auditorLider')
        .populate('director')
        .exec((err, informeDB) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!informeDB) {
                res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se encontro ningún informe relacionado a esa auditoría'
                    }
                })
            }

            res.json({
                ok: true,
                informe: informeDB
            })
        })
})

app.post('/informe', (req, res) => {
    let body = req.body

    let informe = new Informe({
        auditoria: body.auditoria,
        auditorLider: body.auditorLider,
        proceso: body.proceso,
        fecha: body.fecha,
        oportunidadesMejora: body.oportunidadesMejora,
        comentarios: body.comentarios,
        conclusiones: body.conclusiones,
        director: body.director,
        fechaAuditorias: body.fechaAuditorias,
        fechaEmision: body.fechaEmision
    })

    informe.save({ $set: { oportunidadesMejora: body.oportunidadesMejora } }, (err, informeDB) => {
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

app.put('/informe/comentarios/:id', (req, res) => {
    let id = req.params.id
    let body = _.pick(req.body, ['comentarios'])

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

app.put('/informe/conclusiones/:id', (req, res) => {
    let id = req.params.id
    let body = _.pick(req.body, ['conclusiones'])

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

module.exports = app