const mongoose = require('mongoose')

const uniqueValidator = require('mongoose-unique-validator')


let Schema = mongoose.Schema;

let auditoriaSchema = new Schema({

    nombreAuditoria: {
        type: String,
        unique: true,
        required: [true, 'El nombre de la auditoria es necesario']
    },
    normas: [{
        type: Schema.Types.ObjectId,
        ref: 'Norma'
    }],
    fechaInicial: {
        type: Date,
        required: [true, 'La fecha incial de la auditoria es necesario']
    },
    fechaFinal: {
        type: Date,
        required: [true, 'La fecha final de la auditoria es necesario']
    },
    plan: {
        type: Schema.Types.ObjectId,
        ref: 'Plan'
    },
    grupoAuditor: [{
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }],
    auditados: [{
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }],
    objetivos: {
        type: String
            // required: [true, 'Es necesario establecer los objetivos']
    },
    alcance: {
        type: String
            // required: [true, 'El email es necesario']
    },
    contacto: {
        type: String
            // required: [true, 'El telefono es necesario']
    },
    estado: {
        type: Boolean,
        default: false
    }
})

auditoriaSchema.plugin(uniqueValidator, {
    message: 'El nombre de la auditoria debe de ser unico'
})

module.exports = mongoose.model('Auditorias', auditoriaSchema)