var express = require("express");
var fileUpload = require("express-fileupload");
var fs = require("fs"); // file system

var app = express();

// modelos
var Hospital = require("../models/hospital");
var Usuario = require("../models/usuario");
var Medico = require("../models/medico");
// default option
app.use(fileUpload());

app.put("/:tipo/:id", (req, res) => {
    var tipo = req.params.tipo;
    var idUsuario = req.params.id;

    // tipos de colleccion
    var tiposValidos = ["hospitales", "medicos", "usuarios"];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: "Error - Tipo de coleccion invalida",
            errors: { mensaje: "Debe seleccionar una coleccion" },
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: "Error - No se envio ningun archivo",
            errors: {
                mensaje:
                    "Las colecciones validas son " + tiposValidos.join(", "),
            },
        });
    }

    // Obtener nombre del archivo
    var archivo = req.files.imagen; // se manda asi en el form data
    var nombreCortado = archivo.name.split(".");
    var extension = archivo.name.split(".")[nombreCortado.length - 1] || null;

    // solo estas extensiones se aceptan
    var extensionesValidas = ["png", "jpg", "gif", "jpeg"];
    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: "Error - extension no valida",
            errors: {
                mensaje:
                    "Las extensiones validas son " +
                    extensionesValidas.join(", "),
            },
        });
    }

    // Nombre de archivo personalizado
    var nombreArchivo = `${idUsuario}-${new Date().getMilliseconds()}.${extension}`;

    // mover el archivo del temporal a un path especifico
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, (err) => {
        if (err) {
            return res.status(403).json({
                ok: false,
                mensaje: "Error al mover archivo",
                errors: err,
            });
        }
    });

    subirPorTipo(tipo, idUsuario, nombreArchivo, res);
});

function subirPorTipo(tipo, id, nombreArchivo, res) {
    if (tipo === "usuarios") {
        Usuario.findById(id, (err, usuario) => {
            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Error al encontrar usuario",
                    errors: { mensage: "Error al encontrar usuario" },
                });
            }

            var pathViejo = "./uploads/usuarios/" + usuario.img;

            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: "Error al actualizar usuario",
                        errors: err,
                    });
                }
                usuarioActualizado.password = "=)";
                return res.status(200).json({
                    ok: true,
                    mensaje: "Imagen de usuario actualizada",
                    usuarioActualizado,
                });
            });
        });
    }
    if (tipo === "medicos") {
        Medico.findById(id, (err, medico) => {
            if (!medico) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Error al encontrar medico",
                    errors: { mensage: "Error al encontrar medico" },
                });
            }

            var pathViejo = "./uploads/medicos/" + medico.img;

            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            medico.img = nombreArchivo;

            medico.save((err, medicoActualizado) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: "Error al actualizar medico",
                        errors: err,
                    });
                }
                medicoActualizado.password = "=)";
                return res.status(200).json({
                    ok: true,
                    mensaje: "Imagen de medico actualizada",
                    medicoActualizado,
                });
            });
        });
    }
    if (tipo === "hospitales") {
        Hospital.findById(id, (err, hospital) => {
            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Error al encontrar el hospital",
                    errors: { mensage: "Error al encontrar el hospital" },
                });
            }

            var pathViejo = "./uploads/hospitales/" + hospital.img;

            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            hospital.img = nombreArchivo;

            hospital.save((err, hospitalActualizado) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: "Error al actualizar hospital",
                        errors: err,
                    });
                }
                hospitalActualizado.password = "=)";
                return res.status(200).json({
                    ok: true,
                    mensaje: "Imagen de hospital actualizada",
                    hospitalActualizado,
                });
            });
        });
    }
}

module.exports = app;
