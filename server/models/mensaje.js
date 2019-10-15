const mongoose = require('mongoose')

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
    }],
    visto: {
        type: Boolean,
        default: false
    }
})


module.exports = mongoose.model('Mensaje', mensajeSchema)