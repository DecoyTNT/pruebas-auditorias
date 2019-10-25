const mongoose = require('mongoose')

let Schema = mongoose.Schema;

let imagenSchema = new Schema({

    fondo: {
        type: String
    },
    logoLogin: {
        type: String
    },
    logoPequenoClaro: {
        type: String
    },
    logoPequenoOscuro: {
        type: String
    },
    logoGrandeClaro: {
        type: String
    },
    logoGrandeOscuro: {
        type: String
    }

})

module.exports = mongoose.model('Imagenes', imagenSchema)