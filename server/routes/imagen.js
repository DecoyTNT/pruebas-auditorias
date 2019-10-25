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

const Imagen = require('../models/imagen')

const app = express()

app.get('/imagen', (req, res) => {
    Imagen.find({ estado: true })
        .exec((err, imagenes) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            Imagen.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    imagenes: imagenes,
                    cuantos: conteo
                })
            })
        })
})

app.post('/imagen', (req, res) => {
    let body = req.body

    let imagen = new Imagen({
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

app.put('/imagen/:id', (req, res) => {
    let id = req.params.id
    let body = req.body

    Imagen.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, imagenDB) => {
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

app.delete('/imagen/:id', (req, res) => {
    let id = req.params.id

    Imagen.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, imagenBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!imagenBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'imagen no encontrada'
                }
            })
        }

        res.json({
            ok: true,
            imagen: imagenBorrada
        })
    })
})

module.exports = app
    // const express = require('express')

// const { verificaToken } = require('../middlewares/autenticacion')
// const fs = require('fs')

// const path = require('path');

// let app = express()

// app.get('/imagen/:tipo/:img', (req, res) => {
//     let tipo = req.params.tipo
//     let img = req.params.img

//     let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ img }`);
//     if (fs.existsSync(pathImagen)) {
//         res.sendFile(pathImagen);
//     } else {
//         let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
//         res.sendFile(noImagePath);
//     }
// })

// module.exports = app;