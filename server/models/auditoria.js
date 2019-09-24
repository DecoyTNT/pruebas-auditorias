const mongoose = require('mongoose')

const uniqueValidator = require('mongoose-unique-validator')


let Schema = mongoose.Schema;

let auditoriaSchema = new Schema({

    numeroAuditoria: {
        type: Number,
        required: [true, 'El numero de la auditoria es necesario']
    },
    normas: [{
        type: Schema.Types.ObjectId,
        ref: 'Norma'
    }],
    periodo: {
        type: String,
        required: [true, 'El periodo de la auditoria es necesario']
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
        type: String,
        required: [true, 'Es necesario establecer los objetivos']
    },
    alcance: {
        type: String,
        required: [true, 'El email es necesario']
    },
    contacto: {
        type: String,
        required: [true, 'El telefono es necesario']
    }
})

auditoriaSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser unico'
})

module.exports = mongoose.model('Auditorias', auditoriaSchema)