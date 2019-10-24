const { io } = require('../server');
const { crearMensaje } = require('../utilidades/utilidades');
const mongoose = require('mongoose')
let db

// console.log('Tamaño: ' + tamaño);

let tamaño
io.on('connection', (client) => {
    db = mongoose.connection
    db.on('error', console.error.bind(console, 'connection error'))


    db.once('open', () => {
        db.db.stats((err, stats) => {
            tamaño = stats
        })
    })

    console.log('Usuario conectado');


    client.emit('enviarMensaje', {
        usuario: 'Administrador',
        mensaje: 'Bienvenido a esta aplicación',
        size: tamaño
    });



    client.on('disconnect', () => {
        console.log('Usuario desconectado');
    });

    // Escuchar el cliente
    client.on('enviarMensaje', (data, callback) => {

        console.log(data);

        client.broadcast.emit('enviarMensaje', data);


        // if (mensaje.usuario) {
        //     callback({
        //         resp: 'TODO SALIO BIEN!'
        //     });

        // } else {
        //     callback({
        //         resp: 'TODO SALIO MAL!!!!!!!!'
        //     });
        // }



    });

});