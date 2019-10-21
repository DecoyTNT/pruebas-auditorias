const mongoose = require('mongoose')

let Schema = mongoose.Schema;

let auditadoSchema = new Schema({

    informe: {
        type: Schema.Types.ObjectId,
        ref: 'Informe'
    },
    nombre: {
        type: String
    },
    puesto: {
        type: String
    }

})

module.exports = mongoose.model('Auditado', auditadoSchema)