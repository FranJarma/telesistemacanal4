const options =require('../config/knex');
const knex = require('knex')(options);
require('dotenv').config({path: 'variables.env'});

exports.MediosDePagoListar = async(req, res) => {
    try {
        const mediosDePago = await knex.select('*').from('mediopago');
        res.json(mediosDePago);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al encontrar los medios de pago');
    }
}