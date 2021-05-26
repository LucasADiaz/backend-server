var express = require("express");

var mdAutenticacion = require("../middlewares/autenticacion");

var app = express();

var Medico = require("../models/medico");
/*
 *  Obtener Medicos
 */
app.get("/", (req, res) => {
    Medico.find({})
        .populate("usuario", "nombre email")
        .populate("hospital")
        .exec((err, medico) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "Error cargando medico",
                    errors: err,
                });
            }

            res.status(200).json({
                ok: true,
                medicos: medico,
            });
        });
});

/*
 *  actualizar un nuevo Medico
 */

app.put("/:id", mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {
        if (err) {
            //se manejan errores de este lado
            return res.status(500).json({
                ok: false,
                mensaje: "Error al buscar medico",
                errors: err,
            });
        }

        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: "El medico con el id " + id + "no existe.",
                errors: { message: "No existe un medico con ese ID" },
            });
        }

        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital; // solo se manda el id en el body

        medico.save((err, medicoGuardado) => {
            if (err) {
                //se manejan errores de este lado
                return res.status(400).json({
                    ok: false,
                    mensaje: "Error al actualizar medico",
                    errors: err,
                });
            }
            // si se guarda correctamente
            res.status(200).json({
                ok: true,
                medico: medicoGuardado,
            });
        });
    });
});

/*
 *  Crear un nuevo Medico
 */
app.post("/", mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital, //se recibe el id nad amas
        img: null,
    });

    medico.save((err, medicoGuardado) => {
        if (err) {
            //se manejan errores de este lado
            return res.status(400).json({
                ok: false,
                mensaje: "Error al crear medico",
                errors: err,
            });
        }
        // si se guarda correctamente
        res.status(201).json({
            ok: true,
            medico: medicoGuardado,
        });
    });
});

/*
 *  Borrar un Medico
 */
app.delete("/:id", mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
        if (err) {
            //se manejan errores de este lado
            return res.status(500).json({
                ok: false,
                mensaje: "Error al borrar medico",
                errors: err,
            });
        }

        if (!medicoBorrado) {
            //se manejan errores de este lado
            return res.status(400).json({
                ok: false,
                mensaje: "No existe un medico con ese ID",
                errors: { message: "No existe un medico con ese ID" },
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado,
        });
    });
});
module.exports = app;
