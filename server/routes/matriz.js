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
const Informe = require('../models/informe')

const app = express()

app.get('/matriz', (req, res) => {
    Matriz.find()
        .populate('informe')
        .populate('tabla')
        .exec((err, matrices) => {
            if (err) {
                return res.status(500).json({
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
                return res.status(500).json({
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
            return res.status(500).json({
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

app.put('/matriz/:id', (req, res) => {
    let id = req.params.id
    let body = req.body

    Matriz.findById(id, body, { new: true, runValidators: true, context: 'query' }, (err, matrizDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!matrizDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'no se encontro resultados'
                }
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
            return res.status(500).json({
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