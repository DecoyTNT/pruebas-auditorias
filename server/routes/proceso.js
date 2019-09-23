const express = require('express')

const { verificaToken } = require('../middlewares/autenticacion')

const Proceso = require('../models/proceso')

const app = express()

// Obtiene los procesos
app.get('/proceso', (req, res) => {

    // let desde = req.query.desde || 0
    // desde = Number(desde)

    // let limite = req.query.limite || 5
    // limite = Number(limite)

    Proceso.find()
        // .skip(desde)
        // .limit(limite)
        .exec((err, procesos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            Proceso.count((err, conteo) => {
                res.json({
                    ok: true,
                    procesos,
                    cuantos: conteo
                })
            })

        })

})

// Obtiene un proceso por id
app.get('/proceso/:id', (req, res) => {
    var procesoid = req.params.id

    Proceso.findById(procesoid).exec((err, procesoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            proceso: procesoDB
        })

    })
})

// Crea un proceso
app.post('/proceso', (req, res) => {
    let body = req.body

    let proceso = new Proceso({
        nombreProceso: body.nombreProceso
    })

    proceso.save((err, procesoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            proceso: procesoDB
        })
    })


})

// Actualiza un proceso
app.put('/proceso/:id', (req, res) => {
    let id = req.params.id
    let body = req.body

    Proceso.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, procesoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            proceso: procesoDB
        })
    })
})


// Elimina un proceso
app.delete('/proceso/:id', (req, res) => {
    let id = req.params.id
    Proceso.findByIdAndRemove(id, (err, procesoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!procesoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Proceso no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            proceso: procesoBorrado
        })
    })
})

module.exports = app;