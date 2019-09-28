const express = require('express')

const { verificaToken, verificaAdmin, verificaAuditado, verificaAuditor, verificaAuditorLider, verificaAltaDir, } = require('../middlewares/autenticacion')

const Auditoria = require('../models/auditoria')
const Plan = require('../models/plan')

const app = express()

// Obtiene las auditorias
app.get('/auditoria', (req, res) => {

    // let desde = req.query.desde || 0
    // desde = Number(desde)

    // let limite = req.query.limite || 5
    // limite = Number(limite)

    Auditoria.find({ estado: true })
        // .skip(desde)
        // .limit(limite)
        .populate('normas', 'nombreNorma')
        .populate('grupoAuditor', 'nombre')
        .populate('auditados', 'nombre')
        .populate('plan', 'nombrePlan')
        .exec((err, auditorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            Auditoria.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    auditorias,
                    cuantos: conteo
                })
            })

        })

})

// Obtiene una auditoria por id
app.get('/auditoria/:id', (req, res) => {
    var auditoriaid = req.params.id

    Auditoria.findById(auditoriaid)
        .populate('normas', 'nombreNorma')
        .populate('grupoAuditor', 'nombre')
        .populate('auditados', 'nombre')
        .populate('plan', 'nombrePlan')
        .exec((err, auditoriaDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                auditoria: auditoriaDB
            })

        })
})

// Obtiene las auditorias de un plan por id
app.get('/auditoria/plan/:id', (req, res) => {
    var planid = req.params.id

    Plan.findById(planid)
        .exec((err, auditoriaDB) => {
            Auditoria.find({ plan: planid, estado: true })
                // .skip(desde)
                // .limit(limite)
                .populate('plan', 'nombrePlan')
                .exec((err, auditorias) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        })
                    }

                    Auditoria.count({ plan: planid, estado: true }, (err, conteo) => {
                        res.json({
                            ok: true,
                            auditorias,
                            cuantos: conteo
                        })
                    })

                })

        })
})

// Crea una auditoria
app.post('/auditoria', (req, res) => {
    let body = req.body

    let auditoria = new Auditoria({
        nombreAuditoria: body.nombreAuditoria,
        nombre: body.nombre,
        normas: body.normas,
        fechaInicial: body.fechaInicial,
        fechaFinal: body.fechaFinal,
        plan: body.plan,
        grupoAuditor: body.grupoAuditor,
        auditados: body.auditados,
        objetivos: body.objetivos,
        alcance: body.alcance,
        contacto: body.contacto
    })

    auditoria.save({ $set: { normas: body.normas, grupoAuditor: body.grupoAuditor, auditados: body.auditados } }, (err, auditoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            auditoria: auditoriaDB
        })
    })


})

// Actualiza la auditoria
app.put('/auditoria/:id', (req, res) => {
    let id = req.params.id
    let body = req.body
    body.valido = false

    Auditoria.findByIdAndUpdate(id, body, { $set: { normas: body.normas, grupoAuditor: body.grupoAuditor, auditados: body.auditados, body } }, (err, auditoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!auditoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            auditoria: auditoriaDB
        })

    })
})

// Valida la auditoria
app.put('/auditoria/validacion/:id', (req, res) => {
    let id = req.params.id
    let cambiaValido = {
        valido: true
    }

    Auditoria.findByIdAndUpdate(id, cambiaValido, { new: true }, (err, auditoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!auditoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            auditoria: auditoriaDB
        })

    })
})

app.delete('/auditoria/:id', (req, res) => {
    let id = req.params.id
    let cambiaEstado = {
        estado: false
    }

    Auditoria.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, auditoriaBorrada) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!auditoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Auditoria no encontrada'
                }
            })
        }

        res.json({
            ok: true,
            auditoria: auditoriaBorrada
        })
    })
})

// Elimina los subprocesos de un procesos por id
app.delete('/auditoria/plan/:id', (req, res) => {
    var planid = req.params.id
    let cambiaEstado = {
        estado: false
    }

    Plan.findById(planid, (err, planid) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!planid) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Plan no encontrado'
                }
            })
        }
        Auditoria
        // .find({ plan: planid })
        // .skip(desde)
        // .limit(limite)
            .update({ plan: planid }, { estado: false }, { multi: true }, (err, auditoriaBorrada) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!auditoriaBorrada) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Auditoria no encontrada'
                    }
                })
            }


            res.json({
                ok: true,
                auditoria: auditoriaBorrada
            })




        })

    })



})

module.exports = app;