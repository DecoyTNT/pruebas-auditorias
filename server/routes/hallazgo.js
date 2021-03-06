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

const Hallazgo = require('../models/hallazgo')

const app = express()

app.get('/hallazgo', [verificaToken], (req, res) => {

    Hallazgo.find()
        .populate('informe')
        .exec((err, hallazgos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            Hallazgo.count((err, conteo) => {
                res.json({
                    ok: true,
                    hallazgos,
                    cuantos: conteo
                })
            })
        })
})

app.get('/hallazgo/informe/:id', [verificaToken], (req, res) => {
    let id = req.params.id

    Hallazgo.find({ informe: id })
        .populate('informe')
        .exec((err, hallazgos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            Hallazgo.count({ informe: id }, (err, conteo) => {
                return res.json({
                    ok: true,
                    hallazgos,
                    cuantos: conteo
                })
            })
        })
})

app.post('/hallazgo', [verificaToken, verificaAdminAuditorLider], (req, res) => {
    let body = req.body

    hallazgo = new Hallazgo({
        informe: body.informe,
        hallazgo: body.hallazgo,
        requisito: body.requisito
    })

    hallazgo.save((err, hallazgoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            hallazgo: hallazgoDB
        })
    })
})

app.delete('/hallazgo/:id', [verificaToken, verificaAdminAuditorLider], (req, res) => {
    let id = req.params.id

    Hallazgo.findByIdAndRemove(id, (err, hallazgoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!hallazgoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontro esa no conformidad'
                }
            })
        }

        res.json({
            ok: true,
            hallazgo: hallazgoBorrado
        })
    })
})

module.exports = app