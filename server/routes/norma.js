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

const Norma = require('../models/norma')

const app = express()

// Obtiene todas las normas
app.get('/norma', [verificaToken], (req, res) => {

    Norma.find({ estado: true })
        .exec((err, normas) => {
            if (err) {
                return res.status(500).json({
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
app.get('/norma/:id', [verificaToken, verificaAdminAuditorLiderDir], (req, res) => {
    var normid = req.params.id

    Norma.findById(normid).exec((err, normaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!normaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Norma no encontrada'
                }
            })
        }
        res.json({
            ok: true,
            norma: normaDB
        })

    })
})

// Crea una norma
app.post('/norma', [verificaToken, verificaAdmin], (req, res) => {
    let body = req.body

    let norma = new Norma({
        nombreNorma: body.nombreNorma,
        descripcion: body.descripcion,
        archivoDigital: body.archivoDigital,
        color: body.color
    })

    norma.save((err, normaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        const { io } = require('../server');
        io.emit('cambio-norma', 'Norma nueva')
        res.json({
            ok: true,
            norma: normaDB
        })
    })


})

// Actualiza una norma
app.put('/norma/:id', [verificaToken, verificaAdmin], (req, res) => {
    let id = req.params.id
    let body = req.body

    Norma.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, normaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!normaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Norma no encontrada'
                }
            })
        }

        const { io } = require('../server');
        io.emit('cambio-norma', 'Norma actualizada')
        res.json({
            ok: true,
            norma: normaDB
        })
    })
})

// Elimina una norma
app.delete('/norma/:id', [verificaToken, verificaAdmin], (req, res) => {
    let id = req.params.id
    let cambiaEstado = {
        estado: false
    }

    Norma.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, normaBorrada) => {
        if (err) {
            return res.status(500).json({
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

        const { io } = require('../server');
        io.emit('cambio-norma', 'Norma eliminada')
        res.json({
            ok: true,
            norma: normaBorrada
        })
    })
})

module.exports = app;