const express = require('express')

const {
    verificaToken,
    verificaRoot
} = require('../middlewares/autenticacion')

const Imagen = require('../models/imagen')

const app = express()

app.get('/imagen', [verificaToken, verificaRoot], (req, res) => {
    Imagen.find()
        .exec((err, imagenes) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            Imagen.count((err, conteo) => {
                res.json({
                    ok: true,
                    imagenes: imagenes,
                    cuantos: conteo
                })
            })
        })
})

app.post('/imagen', [verificaToken, verificaRoot], (req, res) => {
    let body = req.body

    let imagen = new Imagen({
        fondo: body.fondo,
        logoLogin: body.logoLogin,
        logoPequenoClaro: body.logoPequenoClaro,
        logoPequenoOscuro: body.logoPequenoOscuro,
        logoGrandeClaro: body.logoGrandeClaro,
        logoGrandeOscuro: body.logoGrandeOscuro
    })

    imagen.save((err, imagenDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            imagen: imagenDB
        })
    })
})

app.put('/imagen/fondo/:id', [verificaToken, verificaRoot], (req, res) => {
    let id = req.params.id
    let body = req.body

    Imagen.findByIdAndUpdate(id, { fondo: body.fondo }, { new: true, runValidators: true, context: 'query' }, (err, imagenDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!imagenDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'imagen no encontrada'
                }
            })
        }

        res.json({
            ok: true,
            imagen: imagenDB
        })
    })
})

app.put('/imagen/logologin/:id', [verificaToken, verificaRoot], (req, res) => {
    let id = req.params.id
    let body = req.body

    Imagen.findByIdAndUpdate(id, { logoLogin: body.logoLogin }, { new: true, runValidators: true, context: 'query' }, (err, imagenDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!imagenDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'imagen no encontrada'
                }
            })
        }

        res.json({
            ok: true,
            imagen: imagenDB
        })
    })
})

app.put('/imagen/logopc/:id', [verificaToken, verificaRoot], (req, res) => {
    let id = req.params.id
    let body = req.body

    Imagen.findByIdAndUpdate(id, { logoPequenoClaro: body.logoPequenoClaro }, { new: true, runValidators: true, context: 'query' }, (err, imagenDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!imagenDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'imagen no encontrada'
                }
            })
        }

        res.json({
            ok: true,
            imagen: imagenDB
        })
    })
})

app.put('/imagen/logopo/:id', [verificaToken, verificaRoot], (req, res) => {
    let id = req.params.id
    let body = req.body

    Imagen.findByIdAndUpdate(id, { logoPequenoOscuro: body.logoPequenoOscuro }, { new: true, runValidators: true, context: 'query' }, (err, imagenDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!imagenDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'imagen no encontrada'
                }
            })
        }

        res.json({
            ok: true,
            imagen: imagenDB
        })
    })
})

app.put('/imagen/logogc/:id', [verificaToken, verificaRoot], (req, res) => {
    let id = req.params.id
    let body = req.body

    Imagen.findByIdAndUpdate(id, { logoGrandeClaro: body.logoGrandeClaro }, { new: true, runValidators: true, context: 'query' }, (err, imagenDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!imagenDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'imagen no encontrada'
                }
            })
        }

        res.json({
            ok: true,
            imagen: imagenDB
        })
    })
})

app.put('/imagen/logogo/:id', [verificaToken, verificaRoot], (req, res) => {
    let id = req.params.id
    let body = req.body

    Imagen.findByIdAndUpdate(id, { logoGrandeOscuro: body.logoGrandeOscuro }, { new: true, runValidators: true, context: 'query' }, (err, imagenDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!imagenDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'imagen no encontrada'
                }
            })
        }

        res.json({
            ok: true,
            imagen: imagenDB
        })
    })
})


module.exports = app