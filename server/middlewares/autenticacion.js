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

        return res.status(401).json({
            ok: false,
            err: {
                message: "El usuario no es administrador"
            }
        })
    }

}

// =======================
// Verificar ADMIN o AUDITOR_LIDER
// =======================
let verificaAdminAuditorLider = (req, res, next) => {
    let usuario = req.usuario
    if (usuario.tipo_Usuario === 'ADMIN' || usuario.tipo_Usuario === 'AUDITOR_LIDER' || usuario.tipo_Usuario === 'ROOT') {
        next()
    } else {

        return res.status(401).json({
            ok: false,
            err: {
                message: "El usuario no es administrador o auditor lider"
            }
        })
    }

}

// =======================
// Verificar AUDITADO
// =======================
let verificaAuditado = (req, res, next) => {
    let usuario = req.usuario
    if (usuario.tipo_Usuario === 'AUDITADO' || usuario.tipo_Usuario === 'ROOT') {
        next()
    } else {

        return res.status(401).json({
            ok: false,
            err: {
                message: "El usuario no es auditado"
            }
        })
    }

}

// =======================
// Verificar AUDITOR
// =======================
let verificaAuditor = (req, res, next) => {
    let usuario = req.usuario
    if (usuario.tipo_Usuario === 'AUDITOR' || usuario.tipo_Usuario === 'ROOT') {
        next()
    } else {

        return res.status(401).json({
            ok: false,
            err: {
                message: "El usuario no es auditor"
            }
        })
    }

}

// =======================
// Verificar AUDITOR_LIDER
// =======================
let verificaAuditorLider = (req, res, next) => {
    let usuario = req.usuario
    if (usuario.tipo_Usuario === 'AUDITOR_LIDER' || usuario.tipo_Usuario === 'ROOT') {
        next()
    } else {

        return res.status(401).json({
            ok: false,
            err: {
                message: "El usuario no es auditor lider"
            }
        })
    }

}

// =======================
// Verificar ALTA_DIRECCION
// =======================
let verificaAltaDir = (req, res, next) => {
    let usuario = req.usuario
    if (usuario.tipo_Usuario === 'ALTA_DIRECCION' || usuario.tipo_Usuario === 'ROOT') {
        next()
    } else {

        return res.status(401).json({
            ok: false,
            err: {
                message: "El usuario no es alta dirección"
            }
        })
    }

}

// =====================
// Verifica token para imagen
// =====================
let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();

    });


}

module.exports = {
    verificaToken,
    verificaAdmin,
    verificaAdminAuditorLider,
    verificaAuditado,
    verificaAuditor,
    verificaAuditorLider,
    verificaAltaDir,
    verificaTokenImg
}