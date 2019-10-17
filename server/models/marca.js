const mongoose = require('mongoose')

let Schema = mongoose.Schema;

let marcaSchema = new Schema({

    norma: {
        type: Schema.Types.ObjectId,
        ref: 'Norma'
    },
    marca: {
        type: Boolean,
        default: false
    }

})

module.exports = mongoose.model('Marca', marcaSchema)