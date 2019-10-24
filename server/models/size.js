const mongoose = require('mongoose')
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true })
const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error'))

db.once('open', () => {
    db.db.stats((err, stats) => {
        console.log('stats: ' + stats);
    })
})