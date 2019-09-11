const express = require('express')

const bcrypt = require('bcrypt')

const _ = require('underscore')

const Usuario = require('../models/usuario')
const { verificaToken, verificaAdmin } = require('../middlewares/autenticacion')

const app = express()

// Usuarios Activos
app.get('/usuario', (req, res) => {

    // let desde = req.query.desde || 0
    // desde = Number(desde)

    // let limite = req.query.limite || 5
    // limite = Number(limite)

    Usuario.find({ estado: true, tipo_Usuario: 'ROOT, ADMIN' })
        // .skip(desde)
        // .limit(limite)
        .sort('nombre_Usuario')
        .exec((err, usuarios) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                })
            })

        })
})

// Usuarios Inactivos
app.get('/usuario/inactivos', (req, res) => {

    // let desde = req.query.desde || 0
    // desde = Number(desde)

    // let limite = req.query.limite || 5
    // limite = Number(limite)

    Usuario.find({ estado: false })
        // .skip(desde)
        // .limit(limite)
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
app.get('/usuario/:id', function(req, res) {
    var usid = req.params.id

    Usuario.findById(usid).exec((err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })

    })
})

//Buscador de usuarios
app.get('/usuario/buscar/:termino', (err, res) => {

})

app.post('/usuario', function(req, res) {

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
        // contraseña: body.contraseña,
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

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })

})


// Actualizar Usuario
app.put('/usuario/:id', function(req, res) {

    let id = req.params.id
    let body = _.pick(req.body, ['numero_Empleado', 'nombre_Usuario', 'nombre', 'primer_Apellido', 'segundo_Apellido', 'email', 'telefono', 'puesto', 'tipo_Usuario', 'estado'])


    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
})

// Actualizar Contraseña
app.put('/usuario/password/:id', function(req, res) {

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

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
})

// Activar Usuario
app.put('/usuario/inactivos/:id', function(req, res) {

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

        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    })
})

// Desactivar Usuario
app.delete('/usuario/:id', function(req, res) {

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

        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    })
})

// Borrar Usuario
app.delete('/usuario/inactivos/:id', function(req, res) {

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

        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    })
})

module.exports = app;