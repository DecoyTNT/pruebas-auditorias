const express = require('express')

const _ = require('underscore')

const {
    verificaToken,
    verificaAdmin,
    verificaAdminAuditorLider,
    verificaAdminAuditorLiderDir,
    verificaAuditor,
    verificaAuditorLider,
    verificaAltaDir
} = require('../middlewares/autenticacion')

const Auditoria = require('../models/auditoria')
const Plan = require('../models/plan')

const app = express()

// Obtiene las auditorias
app.get('/auditoria', [verificaToken], (req, res) => {


    Auditoria.find({ estado: true })
        .populate('normas')
        .populate('grupoAuditor')
        .populate('auditados')
        .populate('plan')
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

// Obtiene las auditorias
app.get('/auditoria/usuario/grupoauditor', [verificaToken], (req, res) => {
    let usuario = req.usuario

    Auditoria.find({ estado: true, grupoAuditor: usuario._id })
        .populate('normas')
        .populate('grupoAuditor')
        .populate('auditados')
        .populate('plan')
        .exec((err, auditorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            Auditoria.count({ estado: true, grupoAuditor: usuario._id }, (err, conteo) => {
                res.json({
                    ok: true,
                    auditorias,
                    cuantos: conteo
                })
            })

        })

})

// Obtiene las auditorias
app.get('/auditoria/usuario/auditados', [verificaToken], (req, res) => {
    let usuario = req.usuario

    Auditoria.find({ estado: true, auditados: usuario._id })
        .populate('normas')
        .populate('grupoAuditor')
        .populate('auditados')
        .populate('plan')
        .exec((err, auditorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            Auditoria.count({ estado: true, auditados: usuario._id }, (err, conteo) => {
                res.json({
                    ok: true,
                    auditorias,
                    cuantos: conteo
                })
            })

        })

})

// Obtiene una auditoria por id
app.get('/auditoria/:id', [verificaToken], (req, res) => {
    var auditoriaid = req.params.id

    Auditoria.findById(auditoriaid)
        .populate('normas')
        .populate('grupoAuditor')
        .populate('auditados')
        .populate('plan')
        .exec((err, auditoriaDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
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

// Obtiene las auditorias de un plan por id
app.get('/auditoria/plan/:id', [verificaToken], (req, res) => {
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

            Auditoria.find({ plan: planid, estado: true })
                .populate('normas')
                .populate('grupoAuditor')
                .populate('auditados')
                .populate('plan')
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
app.post('/auditoria', [verificaToken, verificaAdminAuditorLider], (req, res) => {
    let body = req.body
    let cambiaValido = {
        valido: false
    }

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

        Plan.findByIdAndUpdate(body.plan, cambiaValido, { new: true }, (err, planDB) => {
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
                        message: "No se encontro el plan"
                    }
                })
            }
        })

        const { io } = require('../server');
        io.emit('cambio-plan', 'Auditoria nueva')
        res.json({
            ok: true,
            auditoria: auditoriaDB
        })
    })


})

// Actualiza la auditoria
app.put('/auditoria/:id', [verificaToken, verificaAdminAuditorLider], (req, res) => {
    let id = req.params.id
    let body = req.body
    body.progreso = 'encurso'
        // let cambiaValido = {
        //     valido: false
        // }

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
                err: {
                    message: 'No se encontro la auditoría'
                }
            })
        }

        const { io } = require('../server');
        io.emit('cambio-plan', 'Auditoria actualizada')
        res.json({
            ok: true,
            auditoria: auditoriaDB
        })

    })
})

// Cambiar progreso de auditoría
app.put('/auditoria/progreso/:id', [verificaToken, verificaAdminAuditorLider], (req, res) => {
    let id = req.params.id

    Auditoria.findByIdAndUpdate(id, { progreso: 'terminado' }, { new: true }, (err, auditoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!auditoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Auditoría no encontrada'
                }
            })
        }

        const { io } = require('../server');
        io.emit('cambio-plan', 'Auditoria actualizada en progreso')
        res.json({
            ok: true,
            auditoria: auditoriaDB
        })
    })
})

// Valida la auditoria
app.put('/auditoria/validacion/:id', [verificaToken, verificaAltaDir], (req, res) => {
    let id = req.params.id
        // let cambiaValido = {
        //     valido: true
        // }

    Auditoria.findByIdAndUpdate(id, { valido: true, pasos: 2 }, { multi: true }, (err, auditoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!auditoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Auditoría no encontrada'
                }
            })
        }

        const { io } = require('../server');
        io.emit('cambio-plan', 'Auditoria validada')
        res.json({
            ok: true,
            auditoria: auditoriaDB
        })

    })
})

// Cambiar pasos en auditoria
app.put('/auditoria/pasos/:id', [verificaToken, verificaAdminAuditorLider], (req, res) => {
    let id = req.params.id
    let body = _.pick(req.body, ['pasos'])

    Auditoria.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, auditoriaDB) => {
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
                    message: 'No se encontro la auditoría'
                }
            })
        }

        const { io } = require('../server');
        io.emit('cambio-plan', 'Auditoria actualizada en pasos')
        res.json({
            ok: true,
            auditoria: auditoriaDB
        })
    })
})

app.delete('/auditoria/:id', [verificaToken, verificaAdminAuditorLider], (req, res) => {
    let id = req.params.id
    let body = req.body
    let cambiaEstado = {
        estado: false
    }
    let cambiaValido = {
        valido: false
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

        Plan.findByIdAndUpdate(auditoriaBorrada.plan, cambiaValido, { new: true }, (err, planDB) => {
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
                        message: "No se encontro el plan"
                    }
                })
            }
        })

        const { io } = require('../server');
        io.emit('cambio-plan', 'Auditoria eliminada')
        res.json({
            ok: true,
            auditoria: auditoriaBorrada
        })
    })
})


app.delete('/auditoria/plan/:id', [verificaToken, verificaAdminAuditorLider], (req, res) => {
    var planid = req.params.id
    let cambiaEstado = {
        estado: false
    }
    let cambiaValido = {
        valido: false
    }

    Plan.findByIdAndUpdate(planid, cambiaValido, { new: true }, (err, planDB) => {
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
                    message: "No se encontro el plan"
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


            const { io } = require('../server');
            io.emit('cambio-plan', 'Auditorias eliminadas de un plan')
            res.json({
                ok: true,
                auditoria: auditoriaBorrada
            })




        })

    })



})

module.exports = app;