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
    Tabla.find({ estado: true })
        .populate('normas')
        .sort('numero')
        .exec((err, tablas) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            Tabla.count({ estado: true }, (err, conteo) => {
                // console.log('Hola');
                // const { io } = require('../server');

                // io.emit('cambio', tablas)

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
            return res.status(500).json({
                ok: false,
                err
            })
        }

        // const { io } = require('../server');
        // io.on('connection', (client) => {
        //     console.log('Conectado en tabla');
        //     client.emit('cambio', tabla)
        // })
        res.json({
            ok: true,
            tabla: tablaDB
        })
    })
})

app.put('/tabla/estado', (req, res) => {

    Tabla.updateMany({ estado: true }, (err, estados) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            estados
        })
    })
})

//Elimina punto de la tabla
app.delete('/tabla/:id', [verificaToken, verificaAdminAuditorLider], (req, res) => {
    let id = req.params.id

    Tabla.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, tablaBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!tablaBorrada) {
            return res.status(500).json({
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