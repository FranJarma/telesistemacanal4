const { validationResult } = require('express-validator');
const User = require('./../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.UserGet = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
        const {NombreUsuario, Contraseña} = req.body;
        const usuario = await User.findOne({
            where: {
                NombreUsuario: NombreUsuario
        }});
        const contraseñaValida = bcrypt.compareSync(Contraseña, usuario.Contraseña);
        if(!usuario || usuario.EstadoId !== 2 || !contraseñaValida) return res.status(400).json({msg: 'Nombre de usuario o contraseña incorrectos'});
        //aumentar contador de inicio de sesión fallidos
        const payload = {
            Usuario: {
                Id: usuario.UserId
            }
        };
        jwt.sign(payload, process.env.SECRET_KEY,{
            expiresIn: 1800
        },(error, token) =>{
            if (error) {
                throw(error);
            }
            else{
                res.json({token});
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error al iniciar sesión. Comúniquese con el administrador'});
    }
}

exports.UserAutenticate = async (req, res) => {
    try {
        /* consultamos si existe un usuario en la BD por su id que está en el cuerpo de la request,
        no vamos a traer la contraseña del usuario para garantizar seguridad */
        const user = await User.findOne({
            attributes: {
                exclude: ['Contraseña', 'UserId']
            },
            where: {
                NombreUsuario: req.params.NombreUsuario
            }});
        res.json(user);
    } catch (error) {
        console.log(error);
    }
}

