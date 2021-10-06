const options =require('./../config/knex');
const knex = require('knex')(options);
require('dotenv').config({path: 'variables.env'});

exports.ProvinciasListar = async(req, res) => {
    try {
        const provincias = await knex.select('*').from('provincia');
        res.json(provincias);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al encontrar las provincias');
    }
}