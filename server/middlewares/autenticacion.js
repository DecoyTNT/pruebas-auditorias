const jwt = require('jsonwebtoken')


// =======================
// Verificar Token
// =======================
let verificaToken = (req, res, next) => {
    let token = req.query.token;

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

    // res.json({
    //     token: token
    // })
}

// =======================
// Verificar ADMIN
// =======================
let verificaAdmin = (req, res, next) => {
    let usuario = req.usuario
    if (usuario.tipo_Usuario === 'ADMIN') {
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