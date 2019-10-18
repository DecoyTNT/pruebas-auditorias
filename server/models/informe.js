const mongoose = require('mongoose')

let Schema = mongoose.Schema;

let informeSchema = new Schema({

    auditoria: {
        type: Schema.Types.ObjectId,
        ref: 'Auditorias'
    },
    proceso: {
        type: String
    },
    fecha: {
        type: String
    },
    oportunidadesMejora: [{
        type: String
    }],
    comentarios: {
        type: String
    },
    conclusiones: {
        type: String
    },
    recibiConformidad: {
        type: String
    },
    fechaAuditorias: {
        type: String
    },
    fechaEmision: {
        type: String
    },
    estado: {
        type: Boolean,
        default: true
    }

})

module.exports = mongoose.model('Informe', informeSchema)