const express = require('express')

const mongoose = require('mongoose')
const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error'))

let tamaño
db.once('open', () => {
    db.db.stats((err, stats) => {
        tamaño = stats
    })
})

const {
    verificaToken,
    verificaAdmin,
    verificaAdminAuditorLider,
    verificaAuditor,
    verificaAuditorLider,
    verificaAltaDir
} = require('../middlewares/autenticacion')

const app = express()

app.get('/size', (req, res) => {
    res.json({
        ok: true,
        tamaño: tamaño
    })


})

module.exports = app