const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario')
const Institucion = require('../models/institucion')

const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload({ useTempFiles: true }))

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo
    let id = req.params.id

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        })
    }


    // Validar Tipo
    let tiposValidos = ['usuario', 'institucion']
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidas son ' + tiposValidos.join(', ')
            }
        })
    }

    let archivo = req.files.archivo
    let nombreCortado = archivo.name.split('.')
    let extension = nombreCortado[nombreCortado.length - 1]



    // Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'jpeg']

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
                ext: extension
            }
        })
    }

    // Cambiar nombre del archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        // Aqui, imagen cargada
        if (tipo === 'usuario') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenInstitucion(id, res, nombreArchivo);
        }
    });

})

function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'usuario');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {

            borraArchivo(nombreArchivo, 'usuario');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        borraArchivo(usuarioDB.img, 'usuario')

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });

        });


    });


}

function imagenInstitucion(id, res, nombreArchivo) {

    Institucion.findById(id, (err, institucionDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'institucion')

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!institucionDB) {

            borraArchivo(nombreArchivo, 'institucion')

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'institucion no existe'
                }
            });
        }

        borraArchivo(institucionDB.img, 'institucion')

        institucionDB.img = nombreArchivo;

        institucionDB.save((err, institucionGuardado) => {

            res.json({
                ok: true,
                institucion: institucionGuardado,
                img: nombreArchivo
            });

        });


    });
}

function borraArchivo(nombreArchivo, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreArchivo }`);
    if (fs.existsSync(pathImagen)) {
        console.log("Imagen eliminada");

        fs.unlinkSync(pathImagen);
    }


}

module.exports = app