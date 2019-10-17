const express = require('express')

const _ = require('underscore')

const {
    verificaToken,
    verificaAdmin,
    verificaAuditor,
    verificaAuditorLider,
    verificaAltaDir
} = require('../middlewares/autenticacion')

const Tabla = require('../models/tabla')

const app = express()

app.get('/tabla', (req, res) => {
    Tabla.find({ estado: true })
        .sort('numero')
        .exec((err, tablas) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                })
            }
            Tabla.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    tablas,
                    cuantos: conteo
                })
            })
        })
})

app.post('/tabla', (req, res) => {
    let body = req.body

    let tabla = new Tabla({
        numero: body.numero,
        requisito: body.requisito,
        normas: {
            norma: body.norma,
            marca: body.marca
        },
        revision: body.revision,
        resultado: body.resultado
    })

    tabla.save({ set: { normas } }, (err, tablaDB) => {
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