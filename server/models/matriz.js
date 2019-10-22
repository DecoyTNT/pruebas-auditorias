const mongoose = require('mongoose')

const uniqueValidator = require('mongoose-unique-validator')

let revisionValida = {
    values: ['A', 'NA', 'EP'],
    message: '{VALUE} no es una revisión valida'
}

let resultadoValido = {
    values: ['AD', 'NC', 'NR', 'EP', 'NA'],
    message: '{VALUE} no es un resultado valido'
}

let Schema = mongoose.Schema;

let matrizSchema = new Schema({

    informe: {
        type: Schema.Types.ObjectId,
        ref: 'Informe'
    },
    tabla: {
        type: Schema.Types.ObjectId,
        ref: 'Tabla'
    },
    revision: {
        type: String,
        enum: revisionValida,
        default: 'A'
    },
    resultado: {
        type: String,
        enum: resultadoValido,
        default: 'AD'
    }


})

module.exports = mongoose.model('Matrices', matrizSchema)