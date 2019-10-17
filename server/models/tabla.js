const mongoose = require('mongoose')

let Schema = mongoose.Schema;

let tablaSchema = new Schema({

    numero: {
        type: String
    },
    requisito: {
        type: String
    },
    normas: [{
        norma: {
            type: Schema.Types.ObjectId,
            ref: 'Norma'
        },
        marca: {
            type: Boolean,
            default: false
        }
    }],
    revision: {
        type: String
    },
    resultado: {
        type: String
    },
    estado: {
        type: Boolean,
        default: true
    }

})

module.exports = mongoose.model('Tabla', tablaSchema)