const jwt = require ("jsonwebtoken");
const HttpError = require("../utils/httpError");


//Verificar token de autenticación
const authenticateToken =(req, res, next)=>{
    const token = req.headers.authorization?.split(" ")[1];
    if(!token) return next (new HttpError(401, "Acceso denegado: token no encontrado"));

    jwt.verify(token, process.env.JWT_SECRET, (err, payload)=>{
        if(err) return next(new HttpError(403, "Token Invalido o expirado"));
        req.user = payload;
        next();
    });
};

//Control de roles
const requireRole = (...roles) =>(req, res, next)=>{
    if(!req.user || roles.includes(req.user.role))
        return next(new HttpError(403, "No tienes permisos para esta acción"));
}

module.exports = {authenticateToken, requireRole};