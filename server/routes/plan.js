const express = require('express')

const { verificaToken, verificaAdmin, verificaAuditado, verificaAuditor, verificaAuditorLider, verificaAltaDir, } = require('../middlewares/autenticacion')

const Plan = require('../models/plan')

const app = express()

// Obtiene los planes
app.get('/plan', (req, res) => {

    Plan.find({ estado: true })
        .exec((err, planes) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            Plan.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    planes,
                    cuantos: conteo
                })
            })
        })
})

// Obtiene un plan por id
app.get('/plan/:id', (req, res) => {
    var planid = req.params.id

    Plan.findById(planid)
        .exec((err, planDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                plan: planDB
            })

        })
})

// Crea un plan
app.post('/plan', (req, res) => {
    let body = req.body

    let plan = new Plan({
        nombrePlan: body.nombrePlan
    })

    plan.save((err, planDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            plan: planDB
        })
    })

})

// Actualiza un plan
app.put('/plan/:id', (req, res) => {
    let id = req.params.id
    let body = req.body

    Plan.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, planDB) => {
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
            plan: planDB
        })
    })
})

// Actualiza un plan
app.put('/plan/validacion/:id', (req, res) => {
    let id = req.params.id
    let cambiaValido = {
        valido: true
    }

    Plan.findByIdAndUpdate(id, cambiaValido, { new: true }, (err, planDB) => {
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
            plan: planDB
        })
    })
})

// Elimina una norma
app.delete('/plan/:id', (req, res) => {
    let id = req.params.id
    let cambiaEstado = {
        estado: false
    }

    Plan.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, planBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!planBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Plan no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            norma: planBorrado
        })
    })
})

module.exports = app;