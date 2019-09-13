const jwt = require('jsonwebtoken')


// =======================
// Verificar Token
// =======================
let verificaToken = (req, res, next) => {
    // let token = req.get('token')
    let token = req.query.token

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: "Token no válido"
                }
            })
        }

        req.usuario = decoded.usuario
        next()
    })
}

// =======================
// Verificar ADMIN
// =======================
let verificaAdmin = (req, res, next) => {
    let usuario = req.usuario
    if (usuario.tipo_Usuario === 'ADMIN' || usuario.tipo_Usuario === 'ROOT') {
        next()
    } else {

        return res.json({
            ok: false,
            err: {
                message: "El usuario no es administrador"
            }
        })
    }

}


module.exports = {
    verificaToken,
    verificaAdmin
}