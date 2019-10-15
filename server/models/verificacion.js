const mongoose = require('mongoose')

let Schema = mongoose.Schema;

let verificacionSchema = new Schema({

    auditor: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    planeacion: {
        type: Schema.Types.ObjectId,
        ref: 'Planeaciones'
    },
    entrevistado: {
        type: String
    },
    puntoNorma: {
        type: String
    },
    pregunta: {
        type: String
    },
    documento: {
        type: String
    },
    evidencia: {
        type: String
    },
    hallazgos: {
        type: String
    },
    fecha: {
        type: String
    },
    estado: {
        type: Boolean,
        default: true
    }

})

module.exports = mongoose.model('Verificaciones', verificacionSchema)