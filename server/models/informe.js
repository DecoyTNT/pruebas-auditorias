const mongoose = require('mongoose')

let Schema = mongoose.Schema;

let informeSchema = new Schema({

    auditoria: {
        type: Schema.Types.ObjectId,
        ref: 'Auditorias'
    },
    fecha: {
        type: String
    },
    personal: [{
        nombre: {
            type: String
        },
        puesto: {
            type: String
        },
    }],
    noConformidadesTotal: {
        type: String
    },
    oportunidadesMejora: {
        type: String
    },
    comentarios: {
        type: String
    },
    noConformidades: [{
        hallazgo: {
            type: String
        },
        requisito: {
            type: String
        }
    }],
    conclusiones: {
        type: String
    },
    recibiConformidad: {
        type: String
    },
    fechaInforme: {
        type: String
    },
    valido: {
        type: Boolean,
        default: false
    },
    enviar: {
        type: Boolean,
        default: false
    },
    estado: {
        type: Boolean,
        default: true
    }

})

module.exports = mongoose.model('Informe', informeSchema)