const { io } = require('../server');
const { crearMensaje } = require('../utilidades/utilidades');

io.on('connection', (client) => {

    console.log('Usuario conectado');


    client.emit('enviarMensaje', {
        usuario: 'Administrador',
        mensaje: 'Bienvenido a esta aplicación'
    });



    client.on('disconnect', () => {
        console.log('Usuario desconectado');
    });

    // Escuchar el cliente
    client.on('enviarMensaje', (data, callback) => {

        console.log(data);

        client.broadcast.emit('enviarMensaje', data);

    });

    client.on('actualizacion', (data, callback) => {
        client.broadcast.emit('Hubo cambiós')
    })

});