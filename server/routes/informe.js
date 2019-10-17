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
        fecha: body.fecha,
        personal: {
            nombre: body.nombre,
            puesto: body.puesto
        },
        noConformidadesTotal: body.noConformidadesTotal,
        oportunidadesMejora: body.oportunidadesMejora,
        comentarios: body.comentarios,
        noConformidades: {
            hallazgo: body.hallazgo,
            requisito: body.requisito
        },
        conclusiones: body.conclusiones,
        recibiConformidad: body.recibiConformidad,
        fechaInforme: body.fechaInforme
    })

    informe.save({ $set: { personal: [{ nombre: body.nombre, puesto: body.puesto }] } }, (err, informeDB) => {
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

    Informe.findByIdAndUpdate(id, { $push: { personal: [{ nombre: body.nombre, puesto: body.puesto }] } }, { new: true }, (err, informeDB) => {
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