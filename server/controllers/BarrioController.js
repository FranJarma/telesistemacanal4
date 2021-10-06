const options =require('./../config/knex');
const knex = require('knex')(options);
require('dotenv').config({path: 'variables.env'});

exports.BarriosListarPorMunicipio = async(req, res) => {
    try {
        const barrios = await knex.select('*').from('barrio').where('MunicipioId', '=', req.params.id);
        res.json(barrios);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al encontrar los barrios');
    }
}