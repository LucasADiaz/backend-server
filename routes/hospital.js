var express = require("express");

var mdAutenticacion = require("../middlewares/autenticacion");

var app = express();

var Hospital = require("../models/hospital");
/*
 *  Obtener Hospitals
 */
app.get("/", (req, res) => {
    Hospital.find({})
        .populate("usuario", "nombre email")
        .exec((err, hospitales) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "Error cargando hospitales",
                    errors: err,
                });
            }

            res.status(200).json({
                ok: true,
                hospitales,
            });
        });
});

/*
 *  actualizar un nuevo Hospital
 */

app.put("/:id", mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {
        if (err) {
            //se manejan errores de este lado
            return res.status(500).json({
                ok: false,
                mensaje: "Error al buscar hospital",
                errors: err,
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: "El hospital con el id " + id + "no existe.",
                errors: { message: "No existe un hospital con ese ID" },
            });
        }

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save((err, hospitalGuardado) => {
            if (err) {
                //se manejan errores de este lado
                return res.status(400).json({
                    ok: false,
                    mensaje: "Error al actualizar hospital",
                    errors: err,
                });
            }
            // si se guarda correctamente
            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado,
            });
        });
    });
});

/*
 *  Crear un nuevo Hospital
 */
app.post("/", mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id,
    });

    hospital.save((err, hospitalGuardado) => {
        if (err) {
            //se manejan errores de este lado
            return res.status(400).json({
                ok: false,
                mensaje: "Error al crear hospital",
                errors: err,
            });
        }
        // si se guarda correctamente
        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado,
        });
    });
});

/*
 *  Borrar un Hospital
 */
app.delete("/:id", mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
        if (err) {
            //se manejan errores de este lado
            return res.status(500).json({
                ok: false,
                mensaje: "Error al borrar hospital",
                errors: err,
            });
        }

        if (!hospitalBorrado) {
            //se manejan errores de este lado
            return res.status(400).json({
                ok: false,
                mensaje: "No existe un hospital con ese ID",
                errors: { message: "No existe un hospital con ese ID" },
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado,
        });
    });
});
module.exports = app;
