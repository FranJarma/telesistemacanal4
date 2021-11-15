const options =require('./../config/knex');
const knex = require('knex')(options);

exports.PermissionGet = async(req, res) => {
    try {
        const permisos = await knex.select('*').from('_permission as p').orderBy('p.PermissionName');
        res.json(permisos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error al encontrar los permisos'});
    }
}

exports.PermissionGetByRole = async(req, res) => {
    try {
        const permisos = await knex.select('*').from('_permission as p')
        .innerJoin('_rolepermission as rp', 'rp.PermissionId', '=', 'p.PermissionId')
        .where('rp.RoleId','=',req.params.RoleId);
        res.json(permisos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error al encontrar los permisos del rol'});
    }
}