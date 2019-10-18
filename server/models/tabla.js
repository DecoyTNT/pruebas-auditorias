const mongoose = require('mongoose')

const uniqueValidator = require('mongoose-unique-validator')

let Schema = mongoose.Schema;

let tablaSchema = new Schema({

    numero: {
        type: String,
        unique: true
    },
    requisito: {
        type: String
    },
    normas: [{
        type: Schema.Types.ObjectId,
        ref: 'Norma'
    }]

})

tablaSchema.plugin(uniqueValidator, {
    message: 'El número ya existe'
})

module.exports = mongoose.model('Tabla', tablaSchema)