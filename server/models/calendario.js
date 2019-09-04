const mongoose = require('mongoose')

const uniqueValidator = require('mongoose-unique-validator')


let Schema = mongoose.Schema;

let calendarioSchema = new Schema({
    actividad: {
        type: String,
        required: [true, 'La actividad debe de ser necesaria']
    },
    fecha_inicial: {
        type: Date,
        required: [true, 'La fecha inicial es necesaria']
    },
    fecha_final: {
        type: Date,
        required: [true, 'La fecha final es necesaria']
    },
    estado: {
        type: Boolean,
        default: true
    }
})

calendarioSchema.methods.toJSON = function() {
    let user = this
    let userObject = user.toObject()
    delete userObject.password
    return userObject
}

calendarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser unico'
})

module.exports = mongoose.model('Calendario', calendarioSchema)