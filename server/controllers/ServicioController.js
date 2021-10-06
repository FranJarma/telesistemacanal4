const options =require('./../config/knex');
const knex = require('knex')(options);
require('dotenv').config({path: 'variables.env'});

exports.ServiciosListar = async(req, res) => {
    try {
        const servicios = await knex.select('*').from('servicio');
        res.json(servicios);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al encontrar los servicios');
    }
}