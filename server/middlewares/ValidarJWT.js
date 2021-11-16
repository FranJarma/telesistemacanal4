const jwt = require('jsonwebtoken');

//el JWT se manda por HEADERS
const validarJWT = (req, res, next) => {

    const token = req.header('x-auth-token');
    if(!token) return res.status(401).json({msg: 'Token inexistente'});
    try {
        jwt.verify(token, process.env.SECRET_KEY);
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({msg: 'Token no válido'});
    }
    console.log(token);
    next();

}

module.exports = validarJWT;
