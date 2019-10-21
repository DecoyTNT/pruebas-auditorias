const mongoose = require('mongoose')

let Schema = mongoose.Schema;

let hallazgoSchema = new Schema({

    informe: {
        type: Schema.Types.ObjectId,
        ref: 'Informe'
    },
    hallazgo: {
        type: String
    },
    requisito: {
        type: String
    }

})

module.exports = mongoose.model('Hallazgo', hallazgoSchema)