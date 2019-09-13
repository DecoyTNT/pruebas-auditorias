const express = require('express')

const app = express()

app.use(require('./usuario'))
app.use(require('./login'))
app.use(require('./norma'))
app.use(require('./upload'))
app.use(require('./institucion'))
    // app.use(require('./proceso'))
    // app.use(require('./subproceso'))


module.exports = app;