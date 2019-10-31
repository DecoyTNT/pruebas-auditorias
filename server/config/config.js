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
//30 Dias
//6 Meses
process.env.CADUCIDAD_TOKEN = 1000 * 60 * 60 * 24 * 30 * 6

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
    // urlDB = process.env.MONGO_URI
    urlDB = 'mongodb+srv://Administrador:MFoqRpyLvLvTfY15@cluster0-4zhf2.mongodb.net/pruebaRespaldo?retryWrites=true&w=majority'
}


process.env.URLDB = urlDB