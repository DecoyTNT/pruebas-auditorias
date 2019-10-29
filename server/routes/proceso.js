const express = require('express')

const {
    verificaToken,
    verificaAdmin,
    verificaAdminAuditorLider,
    verificaAuditor,
    verificaAuditorLider,
    verificaAltaDir,
} = require('../middlewares/autenticacion')

const Proceso = require('../models/proceso')

const app = express()

// Obtiene los procesos
app.get('/proceso', [verificaToken, verificaAdminAuditorLider], (req, res) => {

    // let desde = req.query.desde || 0
    // desde = Number(desde)

    // let limite = req.query.limite || 5
    // limite = Number(limite)

    Proceso.find({ estado: true })
        // .skip(desde)
        // .limit(limite)
        .exec((err, procesos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            Proceso.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    procesos,
                    cuantos: conteo
                })
            })

        })

})

// Obtiene un proceso por id
app.get('/proceso/:id', [verificaToken, verificaAdminAuditorLider], (req, res) => {
    var procesoid = req.params.id

    Proceso.findById(procesoid).exec((err, procesoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!procesoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Proceso no encontrado'
                }
            })
        }
        res.json({
            ok: true,
            proceso: procesoDB
        })

    })
})

// Crea un proceso
app.post('/proceso', [verificaToken, verificaAdmin], (req, res) => {
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

        const { io } = require('../server');
        io.emit('cambio-proceso', 'Proceso nuevo')
        res.json({
            ok: true,
            proceso: procesoDB
        })
    })


})

// Actualiza un proceso
app.put('/proceso/:id', [verificaToken, verificaAdmin], (req, res) => {
    let id = req.params.id
    let body = req.body

    Proceso.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, procesoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!procesoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Proceso no encontrado'
                }
            })
        }

        const { io } = require('../server');
        io.emit('cambio-proceso', 'Proceso actualizado')
        res.json({
            ok: true,
            proceso: procesoDB
        })
    })
})


// Elimina un proceso
app.delete('/proceso/:id', [verificaToken, verificaAdmin], (req, res) => {
    let id = req.params.id
    let cambiaEstado = {
        estado: false
    }

    Proceso.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, procesoBorrado) => {

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

        const { io } = require('../server');
        io.emit('cambio-proceso', 'Proceso eliminado')
        res.json({
            ok: true,
            proceso: procesoBorrado
        })
    })
})

module.exports = app;