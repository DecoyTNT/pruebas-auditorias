const mongoose = require('mongoose')

let Schema = mongoose.Schema;

let procesoSchema = new Schema({
    nombreProceso: {
        type: String,
        required: [true, 'El nombre del proceso es necesario']
    },
    estado: {
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model('Proceso', procesoSchema)