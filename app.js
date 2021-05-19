// Requires
var express = require("express");
var mongoose = require("mongoose");

// Inicializar variables
var app = express();
const puerto = 3007;

// Conexión a la base de datos
mongoose.connection.openUri(
    "mongodb://localhost:27017/hospitalDB",
    { useNewUrlParser: true, useUnifiedTopology: true }, // no salgan errores molestos
    (err, res) => {
        if (err) throw err;

        console.log("Base de datos: 27017 \x1b[32m%s\x1b[0m", "online");
    },
);

// Rutas
app.get("/", (req, res) => {
    res.status(200).json({
        ok: true,
        mensaje: "Peticion realizada correctamente",
    });
});

// Escuchar peticiones
app.listen(puerto, () => {
    console.log(
        "Express server corriendo en el " + puerto + ": \x1b[32m%s\x1b[0m",
        "online",
    );
});
