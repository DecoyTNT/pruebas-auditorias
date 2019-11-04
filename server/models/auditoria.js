const mongoose = require('mongoose')

const uniqueValidator = require('mongoose-unique-validator')

let Schema = mongoose.Schema;

let auditoriaSchema = new Schema({

    nombreAuditoria: {
        type: String,
        unique: true,
        required: [true, 'El nombre de la auditoria es necesario']
    },
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    normas: [{
        type: Schema.Types.ObjectId,
        ref: 'Norma'
    }],
    fechaInicial: {
        type: String,
        required: [true, 'La fecha incial de la auditoria es necesaria']
    },
    fechaFinal: {
        type: String,
        required: [true, 'La fecha final de la auditoria es necesaria']
    },
    plan: {
        type: Schema.Types.ObjectId,
        ref: 'Planes'
    },
    grupoAuditor: [{
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }],
    objetivos: {
        type: String
    },
    alcance: {
        type: String
    },
    contacto: {
        type: String
    },
    progreso: {
        type: String,
        default: "empezar"
    },
    valido: {
        type: Boolean,
        default: false
    },
    pasos: {
        type: Number,
        default: 0
    },
    estado: {
        type: Boolean,
        default: true
    }
})

auditoriaSchema.plugin(uniqueValidator, {
    message: 'El nombre de la auditoria debe de ser unico'
})

module.exports = mongoose.model('Auditorias', auditoriaSchema)