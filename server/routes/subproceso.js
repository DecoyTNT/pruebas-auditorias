const express = require('express')

const { verificaToken } = require('../middlewares/autenticacion')

const Subproceso = require('../models/subproceso')

const app = express()

// Obtiene los subproceso
app.get('/subproceso', (req, res) => {

    // let desde = req.query.desde || 0
    // desde = Number(desde)

    // let limite = req.query.limite || 5
    // limite = Number(limite)

    Subproceso.find()
        // .skip(desde)
        // .limit(limite)
        .populate('proceso', 'nombreProceso')
        .exec((err, subprocesos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            Subproceso.count((err, conteo) => {
                res.json({
                    ok: true,
                    subprocesos,
                    cuantos: conteo
                })
            })

        })

})

// Obtiene un subproceso por id
app.get('/subproceso/:id', (req, res) => {
    var subprocesoid = req.params.id

    Subroceso.findById(subprocesoid)
        .populate('proceso', 'nombreProceso')
        .exec((err, subprocesoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                subproceso: subprocesoDB
            })

        })
})

// Crea un subproceso
app.post('/subproceso', (req, res) => {
    let body = req.body

    let subproceso = new Subproceso({
        nombreSubproceso: body.nombreSubproceso,
        proceso: body.proceso,
        archivoDigital: body.archivoDigital

    })

    subproceso.save((err, subprocesoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            subproceso: subprocesoDB
        })
    })


})

// Actualiza un subproceso
app.put('/subproceso/:id', (req, res) => {
    let id = req.params.id
    let body = req.body

    Subroceso.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, subprocesoDB) => {
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
            subproceso: subprocesoDB
        })
    })
})


// Elimina un subproceso
app.delete('/subproceso/:id', (req, res) => {
    let id = req.params.id
    Subproceso.findByIdAndRemove(id, (err, subprocesoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!subprocesoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Proceso no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            subproceso: subprocesoBorrado
        })
    })
})

module.exports = app;