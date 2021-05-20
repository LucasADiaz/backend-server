var express = require("express");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

var mdAutenticacion = require("../middlewares/autenticacion");

var app = express();

var Usuario = require("../models/usuario");
/*
 *  Obtener Usuarios
 */
app.get("/", (req, res) => {
    Usuario.find({}, "nombre email img role").exec((err, usuarios) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error cargando usuarios",
                errors: err,
            });
        }

        res.status(200).json({
            ok: true,
            usuarios,
        });
    });
});

/*
 *  actualizar un nuevo Usuario
 */

app.put("/:id", mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {
        if (err) {
            //se manejan errores de este lado
            return res.status(500).json({
                ok: false,
                mensaje: "Error al buscar usuario",
                errors: err,
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: "El usuario con el id " + id + "no existe.",
                errors: { message: "No existe un usuario con ese ID" },
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                //se manejan errores de este lado
                return res.status(400).json({
                    ok: false,
                    mensaje: "Error al actualizar usuario",
                    errors: err,
                });
            }
            // si se guarda correctamente
            usuarioGuardado.password = "=)";
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado,
            });
        });
    });
});

/*
 *  Crear un nuevo Usuario
 */
app.post("/", mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role,
    });

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            //se manejan errores de este lado
            return res.status(400).json({
                ok: false,
                mensaje: "Error al crear usuario",
                errors: err,
            });
        }
        // si se guarda correctamente
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario,
        });
    });
});

/*
 *  Borrar un Usuario
 */
app.delete("/:id", mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            //se manejan errores de este lado
            return res.status(500).json({
                ok: false,
                mensaje: "Error al borrar usuario",
                errors: err,
            });
        }

        if (!usuarioBorrado) {
            //se manejan errores de este lado
            return res.status(400).json({
                ok: false,
                mensaje: "No existe un usuario con ese ID",
                errors: { message: "No existe un usuario con ese ID" },
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado,
        });
    });
});
module.exports = app;
