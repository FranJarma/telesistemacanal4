const options =require('../config/knex');
const knex = require('knex')(options);
require('dotenv').config({path: 'variables.env'});

exports.CondicionesIvaListar = async(req, res) => {
    try {
        const condicionesIva = await knex.select('*').from('condicioniva');
        res.json(condicionesIva);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al encontrar las condiciones IVA');
    }
}