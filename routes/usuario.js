var express = require('express');
var bcrypt = require('bcryptjs');

var mdAutenticacion = require('../middlewares/autenticacion');


var app = express();

var Usuario = require('../models/usuario');

/**
 * Obtener todos los usuarios
 */
app.get('/', (req, res, next ) => {


    Usuario.find({ }, 'nombre email img role')
        .exec(
        
        (err, usuarios) => {

        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando usuario',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            usuarios: usuarios
        });
    });
});




/**
 * Actualizar un usuario
 */
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {
       
        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        if(!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el '+id+' no existe',
                errors: {message: 'No existe un usuario con ese ID'}
            });
        }
        usuario.nombre = body.nombre,
        usuario.email = body.email,
        // usuario.password = bcrypt.hashSync(body.password, 10),
        // usuario.img = body.img,
        usuario.role = body.role

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    menssage: 'Error al actualizar el usuario',
                    errors: err
                })
            }
            usuarioGuardado.password = ':)';
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });    
        });
    });
});



/**
 * Crear un usuario
 */
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    })

    usuario.save((err, usuarioGuardado) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error guardando usuario',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            usuarios: usuarioGuardado,
            usuarioToken: req.usuario
        });
    });

});

/**
 * Borrar un usuairo por el id
 */

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrando usuario',
                errors: err
            });
        }
        if(!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el '+id+' no existe',
                errors: {message: 'No existe un usuario con ese ID'}
            });
        }
        res.status(201).json({
            ok: true,
            usuarios: usuarioBorrado
        });


    })


})

module.exports = app;

