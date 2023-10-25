//importamos modulo express
const express = require('express');
//se habilitan en el middleware los cors
const cors = require('cors');
//carga variables de entorno
require('dotenv').config();

//importamos para trabajar con jwt token
const jwt = require("jsonwebtoken")

const {registrarUsuario,verificarCredenciales,obtenerDatosUsuario} = require('./controllers/controllers');

//Ruta a los middleware
const { VerificaToken,ValidaDatos,ValidaCredenciales}    = require('./middleware/middlewares.js');
const {middlewareReporte} = require('./middleware/reporte.js');

//aqui definimos puertos a utilizare
const PORT = process.env.PORT || 3000; 

const app = express();
app.use(cors());
app.use(express.json());
app.use(middlewareReporte);

app.post("/login", ValidaCredenciales,async (req, res) => {
    try {
        const { email, password } = req.body;
        await verificarCredenciales(email, password);
        const token = jwt.sign({ email }, process.env.SECRET);
        res.send(token);
    } catch ({ code, message }) {
        res.status(code || 500).send(message);
    }
});
app.post("/usuarios", ValidaDatos,async (req, res) => {
    try {
        const usuario = req.body;
       await registrarUsuario(usuario);
        res.status(201).send("Usuario creado Satisfactoriamente");
    } catch ({ code, message }) {
        res.status(code || 500).json(message);
    }
});

app.get("/usuarios", VerificaToken, async (req, res) => {
    try {
        const { email } = req.bearerToken
        result = await obtenerDatosUsuario(email);
        res.json(result);

    } catch ({ code, message }) {
        res.status(code || 500).send(message);
    }
});
app.listen(PORT,()=>{
    console.log(`Servidor de Express escuchando en el puerto ${PORT}`);
});
