const UserRole = require("../models/UserRole");

module.exports = async function(req, res, next){
    //validamos el token
    try {
        const roles = await UserRole.findAll({
            where: {
                UserId: req.UserId
            }
        });
        console.log(roles);
    } catch (error) {
        res.status(401).json({msg:'Su sesión ya ha expirado, por favor, inicie sesión otra vez'});
    }
}