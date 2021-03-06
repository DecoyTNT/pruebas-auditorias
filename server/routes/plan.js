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

const Plan = require('../models/plan')
const Auditoria = require('../models/auditoria')

const app = express()

// Obtiene los planes
app.get('/plan', [verificaToken], (req, res) => {

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
app.get('/plan/:id', [verificaToken], (req, res) => {
    var planid = req.params.id

    Plan.findById(planid)
        .exec((err, planDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            if (!planDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Plan no encontrado'
                    }
                })
            }
            res.json({
                ok: true,
                plan: planDB
            })

        })
})

// Crea un plan
app.post('/plan', [verificaToken, verificaAdminAuditorLider], (req, res) => {
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

        const { io } = require('../server');
        io.emit('cambio-plan', 'Plan nuevo')
        res.json({
            ok: true,
            plan: planDB
        })
    })

})

// Actualiza un plan
app.put('/plan/:id', [verificaToken, verificaAdminAuditorLider], (req, res) => {
    let id = req.params.id
    let body = req.body

    Plan.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, planDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!planDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Plan no encontrado'
                }
            })
        }

        const { io } = require('../server');
        io.emit('cambio-plan', 'Plan actualizado')
        res.json({
            ok: true,
            plan: planDB
        })
    })
})


// Actualiza un plan
app.put('/plan/auditorias/:id', [verificaToken, verificaAdminAuditorLider], (req, res) => {
    let id = req.params.id
    let body = req.body

    Plan.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, planDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!planDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Plan no encontrado'
                }
            })
        }

        Auditoria.find({ plan: id })
            .exec((err, auditorias) => {
                Auditoria.updateMany({ plan: id }, { $set: { nombreAuditoria: `${planDB.nombrePlan}_${auditorias.indexOf[this].nombre}` } }, { multi: true }, (err, auditoriaDB) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        })
                    }

                    if (!auditoriaDB) {
                        return res.status(400).json({
                            ok: false,
                            err: {
                                message: 'Auditoria no encontrada'
                            }
                        })
                    }

                    res.json({
                        ok: true,
                        auditoria: auditoriaDB
                    })
                })




            })


    })
})

// Valida un plan
app.put('/plan/validacion/:id', [verificaToken, verificaAltaDir], (req, res) => {
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

        if (!planDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Plan no encontrado'
                }
            })
        }

        const { io } = require('../server');
        io.emit('cambio-plan', 'Plan validado')
        res.json({
            ok: true,
            plan: planDB
        })
    })
})

// Elimina un plan
app.delete('/plan/:id', [verificaToken, verificaAdminAuditorLider], (req, res) => {
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

        const { io } = require('../server');
        io.emit('cambio-plan', 'Plan desactivado')
        res.json({
            ok: true,
            norma: planBorrado
        })
    })
})

// Elimina definitivamente un plan
app.delete('/plan/eliminar/:id', [verificaToken, verificaAdminAuditorLider], (req, res) => {
    let id = req.params.id

    Plan.findByIdAndRemove(id, (err, planBorrado) => {
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

        const { io } = require('../server');
        io.emit('cambio-plan', 'Plan eliminado')
        res.json({
            ok: true,
            norma: planBorrado
        })
    })
})

module.exports = app;