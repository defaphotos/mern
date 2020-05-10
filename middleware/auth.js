const jwt = require('jsonwebtoken');

module.exports = function(request,response,next){
    const token = request.header('x-auth-token');

    if(!token){
        response.status(401).json({msg:"No hay token, permiso no válido"});
    }

    try {
        const cifrado = jwt.verify(token, process.env.SECRETA);
        request.usuario = cifrado.usuario;
        next();
    } catch (error) {
        console.log(error);
        response.status(500).send("Token no válido");
    }
}