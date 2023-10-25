const jwt = require("jsonwebtoken")
require('dotenv').config();


//esta  funciona se encarga de desempaquetar y validar el token enviado
function VerificaToken(req, res, next) {
    try {
      const Authorization = req.header("Authorization"); 
      if (!Authorization) {
          return res.status(401).json({ message: 'Token no proporcionado.' });   
       }
      
       const token = Authorization.split("Bearer ")[1];
       const bearerToken = jwt.verify(token, process.env.SECRET);
       req.bearerToken = bearerToken; 
       next();
    } catch (error) {
        res.status(401).json({ mensaje: 'Token Invalido'});
    }
}

//esta funcion se encarga de validar que los datos solicitados en el endpoint esten completos  en caso de exito pasa al siguiente middleware.
function ValidaDatos(req, res, next) {
    const { email, password, rol, lenguage } = req.body;
    if (!email || !password || !rol || !lenguage) {
        return res.status(400).json({ message: 'Favor validar los datos ingresados'});
    }
    next();
};

// Verificar siexisten los campos minimos para la solicitud
function ValidaCredenciales(req, res, next) {
    if (!req.body.email || !req.body.password) {
        res.status(401).json({ message: 'Favor Checar los campos Mail y passowrd  ingresados' });
    } else {
      next();
    }
}
module.exports = {VerificaToken,ValidaDatos,ValidaCredenciales};