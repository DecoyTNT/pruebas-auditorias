const express = require('express')

const { verificaToken, verificaAdmin, verificaAuditado, verificaAuditor, verificaAuditorLider, verificaAltaDir, } = require('../middlewares/autenticacion')

const Subproceso = require('../models/subproceso')

const Proceso = require('../models/proceso')

const app = express()

// Obtiene los subproceso
app.get('/subproceso', [verificaToken, verificaAdmin], (req, res) => {

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
app.get('/subproceso/:id', [verificaToken, verificaAdmin], (req, res) => {
    var subprocesoid = req.params.id

    Subproceso.findById(subprocesoid)
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

// Obtiene los subprocesos de un procesos por id
app.get('/subproceso/proceso/:id', [verificaToken, verificaAdmin], (req, res) => {
    var procesoid = req.params.id

    Proceso.findById(procesoid)
        .exec((err, subprocesoDB) => {
            Subproceso.find({ proceso: procesoid })
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

                    Subproceso.count({ proceso: procesoid }, (err, conteo) => {
                        res.json({
                            ok: true,
                            subprocesos,
                            cuantos: conteo
                        })
                    })

                })

        })
})

// Crea un subproceso
app.post('/subproceso', [verificaToken, verificaAdmin], (req, res) => {
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
app.put('/subproceso/:id', [verificaToken, verificaAdmin], (req, res) => {
    let id = req.params.id
    let body = req.body

    Subproceso.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, subprocesoDB) => {
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
app.delete('/subproceso/:id', [verificaToken, verificaAdmin], (req, res) => {
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
                    message: 'Subproceso no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            subproceso: subprocesoBorrado
        })
    })
})

// Elimina los subprocesos de un procesos por id
app.delete('/subproceso/proceso/:id', [verificaToken, verificaAdmin], (req, res) => {
    var procesoid = req.params.id

    Proceso.findById(procesoid, (err, procesoid) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!procesoid) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Proceso no encontrado'
                }
            })
        }
        Subproceso.find({ proceso: procesoid })
            // .skip(desde)
            // .limit(limite)
            .remove((err, subprocesoBorrado) => {
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
                            message: 'Subproceso no encontrado'
                        }
                    })
                }


                res.json({
                    ok: true,
                    subproceso: subprocesoBorrado
                })




            })

    })



})

module.exports = app;