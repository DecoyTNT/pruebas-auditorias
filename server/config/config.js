//================
//Puerto
//================
process.env.PORT = process.env.PORT || 3000;

//================
//Entorno
//================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//================
//Vencimiento del token
//================
//60 Segundos
//60 Minutos
//24 Horas
//30 Días
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30

//================
//SEED de autenticación
//================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'

//================
//Base de Datos
//================
let urlDB
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/ssgi'
} else {
    urlDB = process.env.MONGO_URI
}

process.env.URLDB = urlDB