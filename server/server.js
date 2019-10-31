require('./config/config')
const express = require('express')
const mongoose = require('mongoose')
const socketIO = require('socket.io')
const http = require('http')
const path = require('path')
const cors = require('cors')

const app = express()
let server = http.createServer(app);

app.use(function(req, res, next) {
    // res.header("Access-Control-Allow-Origin", "YOUR-DOMAIN.TLD"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS")
    next();
});

const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// habilitar la carpeta public
// app.use(express.static(path.resolve(__dirname, '../public')));

// Configuración global de rutas
app.use(require('./routes/index'))

// IO = esta es la comunicacion del backend
module.exports.io = socketIO(server);
require('./sockets/socket');

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {
    if (err) throw err;
    console.log('Base de datos online');
});

server.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
})