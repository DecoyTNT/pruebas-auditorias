const mongoose = require('mongoose')

let Schema = mongoose.Schema;

let planeacionSchema = new Schema({

    auditoria: {
        type: Schema.Types.ObjectId,
        ref: 'Auditorias'
    },
    fecha: {
        type: String
    },
    horario: {
        type: String
    },
    proceso: {
        type: Schema.Types.ObjectId,
        ref: 'Proceso'
    },
    actividad: {
        type: String
    },
    criterio: {
        type: String
    },
    participantes: [{
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }],
    contactos: [{
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }],
    area: {
        type: String
    },
    estado: {
        type: Boolean,
        default: true
    }
})


module.exports = mongoose.model('Planeaciones', planeacionSchema)