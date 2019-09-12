const mongoose = require('mongoose')

let Schema = mongoose.Schema;

let procesoSchema = new Schema({
    nombreSubProceso: {
        type: String,
        required: [true, 'El nombre del subproceso es necesario']
    },
    nombreProceso: {
        type: Schema.Types.ObjectId,
        ref: 'Proceso'
    },
    archivoDigital: {
        type: String,
        required: [true, 'El archivo digital es necesario']
    },
    estado: {
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model('SubProceso', procesoSchema)