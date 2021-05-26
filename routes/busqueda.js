var express = require("express");

var app = express();
//importar modelos
var Hospital = require("../models/hospital");
var Usuario = require("../models/usuario");
var Medico = require("../models/medico");
app.get("/todo/:busqueda", (req, res) => {
    var busqueda = req.params.busqueda;

    var regex = new RegExp(busqueda, "i");

    Promise.all([
        buscarHospitales(busqueda, regex),
        buscarMedicos(busqueda, regex),
        buscarUsuarios(busqueda, regex),
    ]).then((resolves) => {
        res.status(200).json({
            ok: true,
            mensaje: "Peticion realizada correctamente",
            hospitales: resolves[0],
            medicos: resolves[1],
            usuarios: resolves[2],
        });
    });
});

function buscarHospitales(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: regex })
            .populate("usuario", "usuario nombre email")
            .exec((err, hospitales) => {
                if (err) {
                    reject("Error al cargar hospitales", err);
                } else {
                    resolve(hospitales);
                }
            });
    });
}

function buscarMedicos(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Medico.find({ nombre: regex })
            .populate("usuario", "nombre email")
            .populate("hospital")
            .exec((err, medicos) => {
                if (err) {
                    reject("Error al cargar medicos", err);
                } else {
                    resolve(medicos);
                }
            });
    });
}

function buscarUsuarios(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Usuario.find({}, "nombre email role")
            .or([{ nombre: regex }, { email: regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject("Error al cargar usuarios", err);
                } else {
                    resolve(usuarios);
                }
            });
    });
}

module.exports = app;
