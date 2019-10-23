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

const Bitacora = require('../models/bitacora')

const app = express()

app.get('/bitacora', (req, res) => {
    Bitacora.find({ estado: true })
        .exec((err, bitacoras) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            Bitacora.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    bitacoras,
                    cuantos: conteo
                })
            })
        })
})

app.post('/bitacora', (req, res) => {
    let body = req.body

    let bitacora = new Bitacora({
        informe: body.informe,
        salida: body.salida,
        noConformidad: body.noConformidad,
        incidente: body.incidente,
        fecha: body.fecha,
        seleccion: body.seleccion,
        correccion: body.correccion,
        causa: body.causa,
        antecedentes: body.antecedentes,
        correctiva: body.correctiva,
        planes: body.planes,
        fechaCumplimiento: body.fechaCumplimiento,
        responsable: body.responsable,
        fechaCierre: body.fechaCierre
    })

    bitacora.save((err, bitacoraDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            bitacora: bitacoraDB
        })
    })
})

app.delete('/bitacora/:id', (req, res) => {
    let id = req.params.id

    Bitacora.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, bitacoraBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!bitacoraBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Bitacora no encontrada'
                }
            })
        }

        res.json({
            ok: true,
            bitacora: bitacoraBorrada
        })
    })
})

module.exports = app