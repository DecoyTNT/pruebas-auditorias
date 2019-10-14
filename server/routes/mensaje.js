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

const Mensaje = require('../models/mensaje')

const app = express()

app.get('/mensaje', (req, res) => {
    Mensaje.find({ mensajePrivado: false })
        .exec((err, mensajes) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            Mensaje.count({ mensajePrivado: false }, (err, conteo) => {
                res.json({
                    ok: true,
                    mensajes,
                    cuantos: conteo
                })
            })
        })
})

app.get('/mensaje/usuario/:id', (req, res) => {
    let idUser = req.params.id
    Mensaje.find({ mensajePrivado: true, usuarios: idUser })
        .exec((err, mensajes) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            Mensaje.count({ mensajePrivado: true, usuarios: idUser }, (err, conteo) => {
                res.json({
                    ok: true,
                    mensajes,
                    cuantos: conteo
                })
            })
        })
})

app.post('/mensaje', (req, res) => {
    let body = req.body

    let mensaje = new Mensaje({
        mensaje: body.mensaje,
        mensajePrivado: body.mensajePrivado,
        usuarios: body.usuarios
    })

    mensaje.save({ $set: { mensajes: body.mensajes, usuarios: body.usuarios } }, (err, mensajeDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            mensaje: mensajeDB
        })
    })
})

app.delete('/mensaje', (req, res) => {
    Mensaje.collection.drop()
    res.json({
        ok: true,
        message: 'Se eliminaron todos los mensajes'
    })
})

module.exports = app;