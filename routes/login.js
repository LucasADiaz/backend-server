var express = require("express");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var SEED = require("../config/config").SEED;
var app = express();

var Usuario = require("../models/usuario");

app.post("/", (req, res) => {
    var body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuarioBD) => {
        if (err) {
            //se manejan errores de este lado
            return res.status(500).json({
                ok: false,
                mensaje: "Error al buscar usuario",
                errors: err,
            });
        }

        if (!usuarioBD) {
            //se manejan errores de este lado
            return res.status(400).json({
                ok: false,
                mensaje: "Credenciales incorrectas - email",
                errors: { message: "Credenciales incorrectas - email" },
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioBD.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: "Credenciales incorrectas - password",
                errors: { message: "Credenciales incorrectas - password" },
            });
        }

        // Crear token!!!
        usuarioBD.password = "=)";
        var token = jwt.sign({ usuario: usuarioBD }, SEED, {
            expiresIn: 14400,
        }); // 4 horas
        res.status(200).json({
            ok: true,
            usuario: usuarioBD,
            token,
            id: usuarioBD._id,
        });
    });
});

module.exports = app;
