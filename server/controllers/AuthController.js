const { validationResult } = require('express-validator');
const User = require('./../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const options =require('./../config/knex');
const knex = require('knex')(options);

exports.UserGet = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
        const {NombreUsuario, Contraseña} = req.body;
        const usuario = await User.findOne({
            where: {
                NombreUsuario: NombreUsuario.trim()
        }});
        if(!usuario || usuario.EstadoId !== 2) return res.status(400).json({msg: 'Nombre de usuario o contraseña incorrectos'});
        const contraseñaValida = bcrypt.compareSync(Contraseña, usuario.Contraseña.trim());
        if(!contraseñaValida) return res.status(400).json({msg: 'Nombre de usuario o contraseña incorrectos'});
        //aumentar contador de inicio de sesión fallidos
        const payload = {
            user: {
                UserId: usuario.UserId
            }
        };
        jwt.sign(payload, process.env.SECRET_KEY,{
            expiresIn: '30m' //expira en 30 minutos
        },(error, token) =>{
            if (error) {
                throw(error);
            }
            else{
                res.json({token, usuario});
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
        const user = await knex.select('u.UserId', 'u.NombreUsuario', 'U.Nombre',
        'u.Apellido', 'u.Email', 'u.Telefono', 'u.Documento')
        .from('_user as u')
        .where('u.UserId', '=', req.UserId)
        let roles = null;
        //si encuentra usuario, traemos los roles y los permisos
        if (user) {
            roles =  await knex.select('r.RoleName', 'r.RoleId')
            .from('_userrole as ur')
            .innerJoin('_role as r', 'r.RoleId', '=', 'ur.RoleId')
            .where('ur.UserId', '=', req.UserId);
        }
        res.json({
            User: user,
            Roles: roles
        });
    } catch (error) {
        console.log(error);
    }
}

