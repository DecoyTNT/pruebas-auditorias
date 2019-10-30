const mongoose = require('mongoose')

let Schema = mongoose.Schema;

let avisoSchema = new Schema({

    titulo: {
        type: String
    },
    aviso: {
        type: String
    },
})


module.exports = mongoose.model('Aviso', avisoSchema)