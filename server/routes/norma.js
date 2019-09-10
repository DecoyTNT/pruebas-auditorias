const express = require('express')

const { verificaToken } = require('../middlewares/autenticacion')

const Norma = require('../models/norma')

const app = express()

// Obtiene todas las normas
app.get('/norma', (req, res) => {

    // let desde = req.query.desde || 0
    // desde = Number(desde)

    // let limite = req.query.limite || 5
    // limite = Number(limite)

    Norma.find()
        // .skip(desde)
        // .limit(limite)
        .exec((err, normas) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Norma.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    normas,
                    cuantos: conteo
                })
            })

        })

})

// Obtiene una norma por id
app.get('/norma/:id', (req, res) => {
    var normid = req.params.id

    Norma.findById(normid).exec((err, normaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            norma: normaDB
        })

    })
})

// Crea una norma
app.post('/norma', (req, res) => {
    let body = req.body

    let norma = new Norma({
        nombreNorma: body.nombreNorma,
        descripcion: body.descripcion,
        archivoDigital: body.archivoDigital,
        estado: body.estado
    })

    norma.save((err, normaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            norma: normaDB
        })
    })


})

// Actualiza una norma
app.put('/norma/:id', (req, res) => {
    let id = req.params.id
    let body = req.body

    Norma.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, normaDB) => {
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
            norma: normaDB
        })
    })
})

// Elimina una norma
app.delete('/norma/:id', (req, res) => {
    let id = req.params.id
    let cambiaEstado = {
        estado: false
    }

    Norma.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, normaBorrada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!normaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Norma no encontrada'
                }
            })
        }

        res.json({
            ok: true,
            norma: normaBorrada
        })
    })
})

module.exports = app;