const express = require('express')

const _ = require('underscore')

const {
    verificaToken,
    verificaAdmin,
    verificaAuditor,
    verificaAuditorLider,
    verificaAltaDir
} = require('../middlewares/autenticacion')

const Marca = require('../models/marca')

const app = express()

app.get('/marca', (req, res) => {
    Marca.find({ estado: true })
        .populate('norma', 'nombreNorma')
        .exec((err, marcas) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                })
            }

            Marca.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    marcas,
                    cuantos: conteo
                })
            })
        })
})

app.post('/marca', (req, res) => {
    let body = req.body

    let marca = new Marca({
        norma: body.norma,
        marca: body.marca
    })

    marca.save((err, tablaDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            tabla: tablaDB
        })
    })
})

module.exports = app