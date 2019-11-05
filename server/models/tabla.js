const mongoose = require('mongoose')

const uniqueValidator = require('mongoose-unique-validator')

let Schema = mongoose.Schema;

let tablaSchema = new Schema({

    num: {
        type: Number
    },
    numero: {
        type: String
    },
    requisito: {
        type: String
    },
    normas: [{
        type: Schema.Types.ObjectId,
        ref: 'Norma'
    }],
    estado: {
        type: Boolean,
        default: true
    }

})

tablaSchema.plugin(uniqueValidator, {
    message: 'El número ya existe'
})

module.exports = mongoose.model('Tabla', tablaSchema)