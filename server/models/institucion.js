const mongoose = require('mongoose')

let Schema = mongoose.Schema;

let institucionSchema = new Schema({
    nombreInstitucion: {
        type: String,
        required: [true, 'El nombre de la institucion es necesario']
    },
    domicilio: {
        type: String,
        required: [true, 'El domicilio es necesario']
    },
    telefono: {
        type: Number,
        required: [true, 'El número de teléfono es necesario']
    }
})

module.exports = mongoose.model('Instituciones', institucionSchema)