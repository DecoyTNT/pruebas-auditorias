const mongoose = require('mongoose')

const uniqueValidator = require('mongoose-unique-validator')

let tiposCorrectiva = {
    values: ['SI', 'NO'],
    message: '{VALUE} no es valido'
}

let Schema = mongoose.Schema;

let bitacoraSchema = new Schema({

    fecha: {
        type: String
    },
    seleccion: {
        type: String
    },
    correccion: {
        type: String
    },
    causa: {
        type: String
    },
    antecedentes: {
        type: String
    },
    correctiva: {
        type: String,
        enum: tiposCorrectiva
    },
    planes: {
        type: String
    },
    fechaCumplimiento: {
        type: String
    },
    responsable: {
        type: String
    },
    fechaCierre: {
        type: String
    },
    estado: {
        type: Boolean,
        default: true
    }

})

module.exports = mongoose.model('Bitacora', bitacoraSchema)