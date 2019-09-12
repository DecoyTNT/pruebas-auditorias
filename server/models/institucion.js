const mongoose = require('mongoose')

let Schema = mongoose.Schema;

let institucionSchema = new Schema({
    nombreInstitucion: {
        type: String,
        required: [true, 'El nombre de la institucion es obligatorio']
    },
    logo: {
        type: String
    },
    direccion: {
        type: String,
        required: [true, 'El archivo es necesario']
    }
})

module.exports = mongoose.model('Institucion', institucionSchema)