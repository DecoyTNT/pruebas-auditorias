const express = require('express')

const app = express()

app.use(require('./usuario'))
app.use(require('./login'))
app.use(require('./norma'))
app.use(require('./upload'))
app.use(require('./institucion'))
app.use(require('./proceso'))
app.use(require('./subproceso'))
app.use(require('./auditoria'))
app.use(require('./plan'))
app.use(require('./planeacion'))
app.use(require('./verificacion'))
app.use(require('./informe'))
app.use(require('./auditado'))
app.use(require('./hallazgo'))
app.use(require('./tabla'))
app.use(require('./matriz'))
app.use(require('./bitacora'))
app.use(require('./size'))
app.use(require('./mensaje'))
app.use(require('./imagen'))


module.exports = app;