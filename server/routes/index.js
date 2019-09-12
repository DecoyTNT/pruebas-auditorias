const express = require('express')

const app = express()

app.use(require('./usuario'))
app.use(require('./login'))
app.use(require('./norma'))
app.use(require('./upload'))
app.use(require('./institucion'))


module.exports = app;