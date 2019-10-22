const express = require('express')

const _ = require('underscore')

const {
    verificaToken,
    verificaAdmin,
    verificaAdminAuditorLider,
    verificaAuditor,
    verificaAuditorLider,
    verificaAltaDir
} = require('../middlewares/autenticacion')

const Tabla = require('../models/tabla')

const app = express()

app.get('/tabla', [verificaToken], (req, res) => {
    Tabla.find()
        .populate('normas')
        .sort('numero')
        .exec((err, tablas) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                })
            }
            Tabla.count((err, conteo) => {
                res.json({
                    ok: true,
                    tablas,
                    cuantos: conteo
                })
            })
        })
})

// Crea punto de la tabla
app.post('/tabla', [verificaToken, verificaAdminAuditorLider], (req, res) => {
    let body = req.body

    let tabla = new Tabla({
        numero: body.numero,
        requisito: body.requisito,
        normas: body.normas
    })

    tabla.save({ $set: { normas: body.normas } }, (err, tablaDB) => {
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

//Elimina punto de la tabla
app.delete('/tabla/:id', [verificaToken, verificaAdminAuditorLider], (req, res) => {
    let id = req.params.id

    Tabla.findByIdAndRemove(id, (err, tablaBorrada) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            })
        }

        if (!tablaBorrada) {
            res.status(500).json({
                ok: false,
                err: {
                    message: 'No se encontro ese punto'
                }
            })
        }

        res.json({
            ok: true,
            tabla: tablaBorrada
        })
    })
})

module.exports = app