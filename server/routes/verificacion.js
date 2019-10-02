const express = require('express')

const {
    verificaToken,
    verificaAdmin,
    verificaAuditado,
    verificaAuditor,
    verificaAuditorLider,
    verificaAltaDir
} = require('../middlewares/autenticacion')

const Verificacion = require('../models/verificacion')
const Planeacion = require('../models/planeacion')
const Auditoria = require('../models/auditoria')

const app = express()