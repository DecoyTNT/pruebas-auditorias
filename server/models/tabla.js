const mongoose = require('mongoose')

let Schema = mongoose.Schema;

let tablaSchema = new Schema({

    numero: {
        type: String
    },
    requisito: {
        type: String
    },
    marcas: [{
        type: Schema.Types.ObjectId,
        ref: 'Marca'
    }]

})

module.exports = mongoose.model('Tabla', tablaSchema)