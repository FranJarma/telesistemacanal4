const options =require('./../config/knex');
const knex = require('knex')(options);

exports.RolesGet = async(req, res) => {
    try {
        const roles = await knex.select('*').from('_role as r');
        res.json(roles);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error al encontrar los roles'});
    }
}

exports.RolesGetByUser = async(req, res) => {
    try {
        const roles = await knex.select('*').from('_role as r')
        .innerJoin('_userrole as ur', 'ur.RoleId', '=', 'r.RoleId')
        .where('ur.UserId','=',req.params.UserId);
        res.json(roles);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error al encontrar los roles del usuario'});
    }
}