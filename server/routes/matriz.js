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

const Matriz = require('../models/matriz')

const app = express()

app.get('/matriz', (req, res) => {
    Matriz.find()
        .populate('informe')
        .populate('tabla')
        .exec((err, matrices) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                })
            }

            Matriz.count((err, conteo) => {
                res.json({
                    ok: true,
                    matrices,
                    cuantos: conteo
                })
            })
        })
})

app.get('/matriz/informe/:id', (req, res) => {
    let id = req.params.id

    Matriz.find({ informe: id })
        .populate('informe')
        .populate('tabla')
        .exec((err, matrices) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                })
            }

            Matriz.count({ informe: id }, (err, conteo) => {
                res.json({
                    ok: true,
                    matrices,
                    cuantos: conteo
                })
            })
        })
})

app.post('/matriz', (req, res) => {
    let body = req.body

    let matriz = new Matriz({
        informe: body.informe,
        tabla: body.tabla,
        revision: body.revision,
        resultado: body.resultado
    })

    matriz.save((err, matrizDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            matriz: matrizDB
        })
    })
})

app.delete('/matriz/informe/:id', (req, res) => {
    let id = req.params.id

    Matriz.remove({ informe: id }, (err, matrices) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            matrices,
        })

    })
})

module.exports = app