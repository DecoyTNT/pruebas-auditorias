const { io } = require('../server');
const { crearMensaje } = require('../utilidades/utilidades');
const mongoose = require('mongoose')
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error'))

let tamaño
db.once('open', () => {
        db.db.stats((err, stats) => {
            tamaño = stats
        })
    })
    // console.log('Tamaño: ' + tamaño);


io.on('connection', (client) => {

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