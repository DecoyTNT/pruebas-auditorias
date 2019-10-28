const { io } = require('../server');
const { crearMensaje } = require('../utilidades/utilidades');

io.on('connection', (client) => {

    console.log('Usuario conectado');


    client.emit('enviarMensaje', {
        usuario: 'Administrador',
        mensaje: 'Bienvenido a esta aplicación'
    });

    // client.on('cambio', (data) => {
    //     console.log('Cambio tabla');
    //     console.log(data);
    //     client.broadcast.emit('cambio', data);
    // })


    client.on('disconnect', () => {
        console.log('Usuario desconectado');
    });

    // Escuchar el cliente
    client.on('enviarMensaje', (data, callback) => {

        console.log(data);

        client.broadcast.emit('enviarMensaje', data);

    });

});