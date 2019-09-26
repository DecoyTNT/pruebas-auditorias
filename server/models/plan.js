const mongoose = require('mongoose')

const uniqueValidator = require('mongoose-unique-validator')

let Schema = mongoose.Schema;

let planSchema = new Schema({

    nombrePlan: {
        type: String,
        unique: true,
        required: [true, 'El periodo de la auditoria es necesario']
    },
    valido: {
        type: Boolean,
        default: false
    },
    estado: {
        type: Boolean,
        default: true
    }
})

planSchema.plugin(uniqueValidator, {
    message: 'El plan debe de ser unico'
})

module.exports = mongoose.model('Planes', planSchema)