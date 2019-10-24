const express = require('express')

const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')

const Usuario = require('../models/usuario')

const { io } = require('../server')
const socket = require('socket.io')

const app = express()

app.post('/login', (req, res) => {
    let body = req.body
    Usuario.findOne({ nombre_Usuario: body.nombre_Usuario, estado: true }, (err, usuarioDB) => {
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
                    message: 'Usuario o Contraseña incorrectos'
                }
            })
        }

        if (!bcrypt.compareSync(body.contraseña, usuarioDB.contraseña)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o Contraseña incorrectos'
                }
            })
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })

        // Enviar información Prueba
        // io.emit('enviarMensaje', {
        //     usuario: usuarioDB.nombre_Usuario,
        //     mensaje: 'Hola Mundo'
        // }, function(resp) {
        //     res.json({
        //             ok: true,
        //             usuario: usuarioDB,
        //             id: usuarioDB._id,
        //             token,
        //             resp
        //         })
        //         // console.log('respuesta server: ', resp);
        // });

        // conectar(usuarioDB)
        res.json({
            ok: true,
            usuario: usuarioDB,
            id: usuarioDB._id,
            token
        })

    })
})

// function conectar(usuarioDB) {

//     socket.on('connect', function() {
//         console.log('Conectado al servidor');
//     });

//     // escuchar
//     socket.on('disconnect', function() {

//         console.log('Perdimos conexión con el servidor');

//     });


//     // Enviar información
//     socket.emit('enviarMensaje', {
//         usuario: usuarioDB.nombre_Usuario,
//         mensaje: 'Hola Mundo'
//     }, function(resp) {
//         console.log('respuesta server: ', resp);
//     });

//     // Escuchar información
//     socket.on('enviarMensaje', function(mensaje) {

//         console.log('Servidor:', mensaje);

//     });

// }


module.exports = app;