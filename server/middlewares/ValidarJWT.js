const jwt = require('jsonwebtoken');

//el JWT se manda por HEADERS
const validarJWT = (req, res, next) => {

    const token = req.header('x-auth-token');
    if(!token) return res.status(401).json({msg: 'Error de autenticación'});
    try {
        const { user } = jwt.verify(token, process.env.SECRET_KEY);
        req.UserId = user.UserId;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({msg: 'Error de autenticación'});
    }
    next();

}

module.exports = validarJWT;
