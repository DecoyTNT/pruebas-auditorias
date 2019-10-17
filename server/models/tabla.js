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
        type: Schema.Types.ObjectId,
        ref: 'Norma'
    }]

})

module.exports = mongoose.model('Tabla', tablaSchema)