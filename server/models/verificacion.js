const mongoose = require('mongoose')

let Schema = mongoose.Schema;

let verificacionSchema = new Schema({

    auditor: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    proceso: {
        type: Schema.Types.ObjectId,
        ref: 'Proceso'
    },
    procedimiento: {
        type: String
    },
    area: {
        type: String
    },
    actividad: {
        type: String
    },
    auditoria: {
        type: Schema.Types.ObjectId,
        ref: 'Auditorias'
    },
    entrevistado: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    norma: {
        type: Schema.Types.ObjectId,
        ref: 'Norma'
    },
    puntoNorma: [{
        type: String
    }],
    pregunta: [{
        type: String
    }],
    documento: [{
        type: String
    }],
    evidencia: [{
        type: String
    }],
    hallazgos: [{
        type: String
    }],
    fecha: {
        type: String
    }

})

module.exports = mongoose.model('Verificaciones', verificacionSchema)