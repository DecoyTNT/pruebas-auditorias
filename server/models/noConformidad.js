const mongoose = require('mongoose')

let Schema = mongoose.Schema;

let noConformidadSchema = new Schema({

    numero: {
        type: String,
        unique: true
    },
    hallazgo: {
        type: String
    },
    requisito: {
        type: String
    }

})

module.exports = mongoose.model('NoConformidades', noConformidadSchema)