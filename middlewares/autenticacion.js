var jwt = require("jsonwebtoken");
var SEED = require("../config/config").SEED;

/*
 *  Verificar utoken
 */
exports.verificaToken = function (req, res, next) {
    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            //se manejan errores de este lado
            return res.status(401).json({
                //401 : no autorizado
                ok: false,
                mensaje: "Token no valido.",
                errors: err,
            });
        }
        req.usuario = decoded.usuario;
        next();

        //
    });
};
