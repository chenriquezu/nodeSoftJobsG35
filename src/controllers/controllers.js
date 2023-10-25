const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

require('dotenv').config();

//configuramos el entorno del servidor de conexion a pg
const conexion =  new Pool({
    user: process.env.DBP_USER,
    host: process.env.DBP_SERVER,
    database: process.env.DBP_DATABASE,
    password: process.env.DBP_PASSWORD,
    port: process.env.DBP_PORT,
    allowExitOnIdle: true,
    max:20   
});

//REGISTRA UN NUEVO USUARIO EN LA APLICACION
const registrarUsuario = async (usuario) => {
    try {
        const { email, password, rol, lenguage } = usuario;
        const emailExistente = await conexion.query("SELECT email FROM usuarios WHERE email = $1", [email] );
       
        if (emailExistente.rows.length > 0) {
            throw { code: 400, message: "Correo Ingresado ya se encuentra registyrado en la DB"};
        } 

        const passwordEncriptada = bcrypt.hashSync(password);
        const values = [email, passwordEncriptada, rol, lenguage];
        const strsql = "INSERT INTO usuarios (email, password, rol, lenguage) values($1,$2,$3,$4) RETURNING *";
        const result = await conexion.query(strsql, values);
        return result.rows[0];
    } catch (error) {
        if (error.code) {
            throw error;
        } else {
            console.log(error);
            throw { code: 500, message: "Hay un error interno en el sistema." };
        }
    }
}

//VERIFICA CREDENCIALES EN AUTENTIFICACION
const verificarCredenciales = async (email, password) => {
    let usuario;
    let rowCount;
    const values = [email];
    const strsql = "SELECT * FROM usuarios WHERE email = $1";

    try {
        const result = await conexion.query(strsql, values);
        usuario = result.rows[0];
        rowCount = result.rowCount;

    } catch (error) {
        throw { code: 500, message: "Hay un error interno en el sistema." };
    }

    if (!usuario || !usuario.password) {
        throw { code: 401, message: "Usuario no existe en el sistema." };
    }

    const { password: passwordEncriptada } = usuario;
    const passwordEsCorrecta = bcrypt.compareSync(password, passwordEncriptada);

    if (!passwordEsCorrecta || !rowCount) {
        throw { code: 401, message: "Email o contraseña incorrecta." };
    }
};


const obtenerDatosUsuario = async (email) => {
    try {
        const strsql = "SELECT email, rol, lenguage FROM usuarios WHERE email=$1";
        const values = [email];
        const { rowCount, rows } = await conexion.query(strsql, values)
        if (!rowCount) throw { code: 404, message: "No existe usuario asignado a este Email" }
        return rows[0];
    } catch (error) {
        throw { code: error.code || 500, message: "Error interno de sistema." };
    }
}
module.exports={registrarUsuario,verificarCredenciales,obtenerDatosUsuario};

