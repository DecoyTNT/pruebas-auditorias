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
//1000 Milisegundos
//60 Segundos
//60 Minutos
//24 Horas
process.env.CADUCIDAD_TOKEN = 1000 * 60 * 60 * 24

//================
//SEED de autenticación
//================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'

//================
//Base de Datos
//================
let urlDB
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/sgi'
} else {
    urlDB = process.env.MONGO_URI
        // urlDB = process.env.MONGO_Prueba
}

process.env.URLDB = urlDB