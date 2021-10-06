const options =require('../config/knex');
const knex = require('knex')(options);
require('dotenv').config({path: 'variables.env'});

exports.ModelosOnuListar = async(req, res) => {
    try {
        const modelosOnu = await knex.select('*').from('modeloonu');
        res.json(modelosOnu);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al encontrar los modelos de onu');
    }
}