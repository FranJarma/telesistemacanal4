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