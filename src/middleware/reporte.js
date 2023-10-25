const  middlewareReporte =  (req, res,next) => {
    try {
        fecha=new Date().toLocaleString('es-Es');
        console.log(`---------------------`);
        console.log(`BITACORA TRANSACCIONES`);
        console.log('Url Origen:', req.hostname);
        console.log(`Solicitud Enviada: ${req.method}`);
        console.log(`EndPoint: ${req.path}`);
        console.log("Fecha Solicitud: ",fecha);
        if (Object.keys(req.params).length > 0) console.log('req.params:', JSON.stringify(req.params, null, 2));
        if (Object.keys(req.query).length > 0) console.log('req.query: ', JSON.stringify(req.query, null, 2));
        console.log(`---------------------`);
        next();
    } catch (error) {
        res.status(500).json({ error: "Error al obtener al realizar el reporte." });
    }
};


module.exports = {middlewareReporte};