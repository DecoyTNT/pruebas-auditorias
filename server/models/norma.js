const mongoose = require('mongoose')

// const uniqueValidator = require('mongoose-unique-validator')


let Schema = mongoose.Schema;

let normaSchema = new Schema({
    nombreNorma: {
        type: String,
        required: [true, 'El nombre de la norma es necesario']
    },
    descripcion: {
        type: String
    },
    archivoDigital: {
        type: String,
        required: [true, 'El archivo es necesario']
    },
    color: {
        type: String,
        required: [true, 'El color es necesario']
    },
    estado: {
        type: Boolean,
        default: true
    }
})


module.exports = mongoose.model('Norma', normaSchema)