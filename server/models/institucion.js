const mongoose = require('mongoose')

const uniqueValidator = require('mongoose-unique-validator')


let Schema = mongoose.Schema;

let institucionSchema = new Schema({
    nombreNorma: {
        type: String,
        unique: true,
        required: [true, 'El nombre de la norma es obligatorio']
    },
    descripcion: {
        type: String
    },
    archivoDigital: {
        type: String,
        required: [true, 'El archivo es necesario']
    },
    estado: {
        type: Boolean,
        default: true
    }
})

institucionSchema.methods.toJSON = function() {
    let user = this
    let userObject = user.toObject()
    return userObject
}

institucionSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser unico'
})

module.exports = mongoose.model('Norma', institucionSchema)