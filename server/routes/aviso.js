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

const Aviso = require('../models/aviso')

const app = express()

app.get('/aviso', [verificaToken], (req, res) => {
    Aviso.find()
        .exec((err, avisos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            Aviso.count((err, conteo) => {
                res.json({
                    ok: true,
                    avisos,
                    cuantos: conteo
                })
            })
        })
})

app.post('/aviso', [verificaToken, verificaAdmin], (req, res) => {
    let body = req.body

    let aviso = new Aviso({
        titulo: body.titulo,
        aviso: body.aviso
    })

    aviso.save((err, avisoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        const { io } = require('../server');
        io.emit('cambio-aviso', 'Aviso nuevo')
        res.json({
            ok: true,
            aviso: avisoDB
        })
    })
})

app.delete('/aviso/:id', [verificaToken, verificaAdmin], (req, res) => {
    let id = req.params.id

    Aviso.findByIdAndRemove(id, (err, avisoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!avisoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Aviso no encontrado'
                }
            })
        }

        const { io } = require('../server');
        io.emit('cambio-aviso', 'Aviso eliminado')
        res.json({
            ok: true,
            aviso: avisoBorrado
        })
    })
})

module.exports = app;