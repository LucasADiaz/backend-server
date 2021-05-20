// Requires
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

// Inicializar variables
var app = express();
const puerto = 3007;
const DataBaseName = "hospitalDB";

// body parser / parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Importar rutas
var appRoutes = require("./routes/app");
var usuarioRoutes = require("./routes/usuarios");
var loginRoutes = require("./routes/login");

// Conexión a la base de datos
mongoose.connection.openUri(
    "mongodb://localhost:27017/" + DataBaseName,
    { useNewUrlParser: true, useUnifiedTopology: true }, // no salgan errores molestos
    (err, res) => {
        if (err) throw err;

        console.log("Base de datos: 27017 \x1b[32m%s\x1b[0m", "online");
    },
);

// Rutas
app.use("/usuario", usuarioRoutes);
app.use("/login", loginRoutes);
app.use("/", appRoutes);

// Escuchar peticiones
app.listen(puerto, () => {
    console.log(
        "Express server corriendo en el " + puerto + ": \x1b[32m%s\x1b[0m",
        "online",
    );
});
