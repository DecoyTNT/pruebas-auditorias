const mongoose = require('mongoose')

const uniqueValidator = require('mongoose-unique-validator')

let Schema = mongoose.Schema;

let mensajeSchema = new Schema({

    mensaje: {
        type: String
    },
    mensajePrivado: {
        type: Boolean,
        default: false
    },
    usuarios: [{
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }]
})


module.exports = mongoose.model('Mensaje', mensajeSchema)