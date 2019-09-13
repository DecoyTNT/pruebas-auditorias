const mongoose = require('mongoose')

let Schema = mongoose.Schema;

let subprocesoSchema = new Schema({
    nombreSubproceso: {
        type: String,
        required: [true, 'El nombre del subproceso es necesario']
    },
    proceso: {
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

module.exports = mongoose.model('Subproceso', subprocesoSchema)