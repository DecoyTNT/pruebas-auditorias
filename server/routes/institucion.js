const express = require('express')

const { verificaToken, verificaAdmin, verificaAdminAuditorLider, verificaAuditado, verificaAuditor, verificaAuditorLider, verificaAltaDir, } = require('../middlewares/autenticacion')

const Institucion = require('../models/institucion')

const app = express()

// Obtiene la institucion
app.get('/institucion', [verificaToken, verificaAdminAuditorLider], (req, res) => {

    // let desde = req.query.desde || 0
    // desde = Number(desde)

    // let limite = req.query.limite || 5
    // limite = Number(limite)

    Institucion.find()
        // .skip(desde)
        // .limit(limite)
        .exec((err, instituciones) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            Institucion.count((err, conteo) => {
                res.json({
                    ok: true,
                    instituciones,
                    cuantos: conteo
                })
            })

        })

})

// Obtiene una institucion por id
app.get('/institucion/:id', [verificaToken, verificaAdminAuditorLider], (req, res) => {
    var institucionid = req.params.id

    Institucion.findById(institucionid).exec((err, institucionDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!institucionDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontró la institución'
                }
            })
        }
        res.json({
            ok: true,
            institucion: institucionDB
        })

    })
})

// Crea una institucion
app.post('/institucion', [verificaToken, verificaAdmin], (req, res) => {
    let body = req.body

    let institucion = new Institucion({
        nombreInstitucion: body.nombreInstitucion,
        domicilio: body.domicilio,
        telefono: body.telefono,
        img: body.img

    })

    institucion.save((err, institucionDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            institucion: institucionDB
        })
    })


})

// Actualiza la institucion
app.put('/institucion/:id', [verificaToken, verificaAdmin], (req, res) => {
    let id = req.params.id
    let body = req.body

    Institucion.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, institucionDB) => {
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
            institucion: institucionDB
        })
    })
})

app.delete('/institucion/:id', [verificaToken, verificaAdmin], (req, res) => {
    let id = req.params.id
    Institucion.findByIdAndRemove(id, (err, institucionBorrada) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!institucionBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Institucion no encontrada'
                }
            })
        }

        res.json({
            ok: true,
            institucion: institucionBorrada
        })
    })
})

module.exports = app;