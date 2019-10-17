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
    Marca.find()
        .populate('norma', 'nombreNorma')
        .exec((err, marcas) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                })
            }

            Marca.count((err, conteo) => {
                res.json({
                    ok: true,
                    marcas,
                    cuantos: conteo
                })
            })
        })
})

app.get('/marca/norma/:id', (req, res) => {
    let normaid = req.params.id

    Marca.find({ norma: normaid })
        .populate('norma', 'nombreNorma')
        .exec((err, marcas) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                })
            }

            Marca.count({ norma: normaid }, (err, conteo) => {
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