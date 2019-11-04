const express = require('express')

const bcrypt = require('bcrypt')

const _ = require('underscore')

const Usuario = require('../models/usuario')

const {
    verificaToken,
    verificaAdmin,
    verificaAdminAuditorLider,
    verificaAdminAuditorLiderDir,
    verificaAuditor,
    verificaAuditorLider,
    verificaAltaDir
} = require('../middlewares/autenticacion')

const app = express()

// Usuarios Activos
app.get('/usuario', [verificaToken, verificaAdminAuditorLiderDir], (req, res) => {

    Usuario.find({ estado: true, tipo_Usuario: ['ADMIN', 'AUDITOR_LIDER', 'AUDITOR', 'AUDITADO', 'ALTA_DIRECCION'] })
        .sort('nombre_Usuario')
        .exec((err, usuarios) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            Usuario.count({ estado: true, tipo_Usuario: ['ADMIN', 'AUDITOR_LIDER', 'AUDITOR', 'AUDITADO', 'ALTA_DIRECCION'] }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                })
            })

        })
})

// Usuarios Activos
app.get('/usuario/tipo/:termino', [verificaToken], (req, res) => {

    let termino = req.params.termino

    Usuario.find({ estado: true, tipo_Usuario: termino })
        .sort('nombre_Usuario')
        .exec((err, usuarios) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            Usuario.count({ estado: true, tipo_Usuario: termino }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                })
            })

        })
})

// Usuarios Inactivos
app.get('/usuario/inactivos', [verificaToken, verificaAdmin], (req, res) => {

    Usuario.find({ estado: false })
        .exec((err, usuarios) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            Usuario.count({ estado: false }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                })
            })

        })
})

//Obtener un usuario por id
app.get('/usuario/:id', [verificaToken], function(req, res) {
    var usid = req.params.id

    Usuario.findById(usid).exec((err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })

    })
})

// //Buscador de usuarios
// app.get('/usuario/buscar/:termino', (req, res) => {
//     let termino = req.params.termino;

//     let regex = new RegExp(termino, 'i');

//     Usuario.find({ nombre_Usuario: regex, estado: true, tipo_Usuario: ['ADMIN', 'AUDITOR_LIDER', 'AUDITOR', 'AUDITADO', 'ALTA_DIRECCION'] })
//         .sort('nombre_Usuario')
//         .exec((err, usuarios) => {
//             if (err) {
//                 return res.status(500).json({
//                     ok: false,
//                     err
//                 })
//             }

//             Usuario.count({ estado: true, tipo_Usuario: ['ADMIN', 'AUDITOR_LIDER', 'AUDITOR', 'AUDITADO', 'ALTA_DIRECCION'] }, (err, conteo) => {
//                 res.json({
//                     ok: true,
//                     usuarios,
//                     cuantos: conteo
//                 })
//             })

//         })

// })


// Crear Usuario
app.post('/usuario', [verificaToken, verificaAdmin], function(req, res) {

    let body = req.body

    let usuario = new Usuario({
        numero_Empleado: body.numero_Empleado,
        nombre_Usuario: body.nombre_Usuario,
        nombre: body.nombre,
        primer_Apellido: body.primer_Apellido,
        segundo_Apellido: body.segundo_Apellido,
        email: body.email,
        telefono: body.telefono,
        puesto: body.puesto,
        contraseña: bcrypt.hashSync(body.contraseña, 10),
        tipo_Usuario: body.tipo_Usuario
    })

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        const { io } = require('../server');
        io.emit('cambio-usuario', 'Usuario nuevo')
        res.status(201).json({
            ok: true,
            usuario: usuarioDB
        })
    })

})

// Validacion de director
app.post('/usuario/director/:id', [verificaToken, verificaAltaDir], (req, res) => {
    let id = req.params.id
    let body = req.body

    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        if (!bcrypt.compareSync(body.contraseña, usuarioDB.contraseña)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Contraseña incorrecta'
                }
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })

    })
})

// Validacion de auditor lider
app.post('/usuario/lider/:id', [verificaToken, verificaAuditorLider], (req, res) => {
    let id = req.params.id
    let body = req.body

    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        if (!bcrypt.compareSync(body.contraseña, usuarioDB.contraseña)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Contraseña incorrecta'
                }
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })

    })
})


// Actualizar Usuario
app.put('/usuario/:id', [verificaToken, verificaAdmin], function(req, res) {

    let id = req.params.id
    let body = _.pick(req.body, ['numero_Empleado', 'nombre_Usuario', 'nombre', 'primer_Apellido', 'segundo_Apellido', 'email', 'telefono', 'puesto', 'tipo_Usuario', 'estado'])


    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        const { io } = require('../server');
        io.emit('cambio-usuario', 'Usuario actualizado')
        res.status(201).json({
            ok: true,
            usuario: usuarioDB
        })
    })
})

// Actualizar correo y telefono
app.put('/usuario/miperfil/:id', verificaToken, function(req, res) {

    let id = req.params.id
    let body = _.pick(req.body, ['email', 'telefono'])


    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
})

// Actualizar Contraseña
app.put('/usuario/password/:id', [verificaToken, verificaAdmin], function(req, res) {

    let id = req.params.id
    let body = req.body
    let contraseña = bcrypt.hashSync(body.contraseña, 10)

    Usuario.findByIdAndUpdate(id, { contraseña }, { new: true, runValidators: true, context: 'query' }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
})

// Activar Usuario
app.put('/usuario/inactivos/:id', [verificaToken, verificaAdmin], function(req, res) {

    let id = req.params.id
    let cambiaEstado = {
        estado: true
    }
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        const { io } = require("../server");
        io.emit("cambio-usuario", "Usuario activado");
        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    })
})

// Desactivar Usuario
app.delete('/usuario/:id', [verificaToken, verificaAdmin], function(req, res) {

    let id = req.params.id
    let cambiaEstado = {
        estado: false
    }
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        const { io } = require("../server");
        io.emit("cambio-usuario", "Usuario desactivado");
        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    })
})

// Borrar Usuario
app.delete('/usuario/inactivos/:id', [verificaToken, verificaAdmin], function(req, res) {

    let id = req.params.id
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        const { io } = require("../server");
        io.emit("cambio-usuario", "Usuario eliminado");
        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    })
})

module.exports = app;