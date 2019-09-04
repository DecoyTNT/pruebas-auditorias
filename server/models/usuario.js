const mongoose = require('mongoose')

const uniqueValidator = require('mongoose-unique-validator')

let tiposValidos = {
    values: ['ADMIN', 'AUDITOR_LIDER', 'AUDITOR', 'AUDITADO', 'ALTA_DIRECCION'],
    message: '{VALUE} no es un tipo valido'
}

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    numero_Empleado: {
        type: Number,
        //unique: true,
        required: [true, 'El numero de empleado es necesario']
    },
    nombre_Usuario: {
        type: String,
        unique: true,
        required: [true, 'El nombre de usuario es necesario']
    },
    contraseña: {
        type: String,
        required: [true, 'La contraseña es necesaria']
    },
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    primer_Apellido: {
        type: String,
        required: [true, 'El primer apellido es necesario']
    },
    segundo_Apellido: {
        type: String
    },
    email: {
        type: String,
        //unique: true,
        required: [true, 'El email es necesario']
    },
    telefono: {
        type: Number,
        //unique: true,
        required: [true, 'El telefono es necesario']
    },
    puesto: {
        type: String,
        required: [true, 'El puesto es necesario']
    },
    tipo_Usuario: {
        type: String,
        enum: tiposValidos
    },
    estado: {
        type: Boolean,
        default: true
    }
})

usuarioSchema.methods.toJSON = function() {
    let user = this
    let userObject = user.toObject()
    delete userObject.contraseña
    return userObject
}

usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser unico'
})

module.exports = mongoose.model('Usuario', usuarioSchema)