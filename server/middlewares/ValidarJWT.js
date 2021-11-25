const jwt = require('jsonwebtoken');

module.exports = function(req, res, next){
    //leemos el token del header
    const token = req.header('x-auth-token');
    //revisamos si no hay token
    if(!token){
        return res.status(401).json({msg:'Inicie sesión antes de continuar'});
    }
    //validamos el token
    try {
        const cifrado = jwt.verify(token, process.env.SECRET_KEY);
        req.UserId = cifrado.user.UserId;
        next();
    } catch (error) {
        res.redirect('/');
        res.status(401).json({msg:'Su sesión ya ha expirado, por favor, inicie sesión otra vez'});
    }
}