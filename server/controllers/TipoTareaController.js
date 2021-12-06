const { validationResult } = require('express-validator');
const db = require('../config/connection');
const options =require('./../config/knex');
const knex = require('knex')(options);
require('dotenv').config({path: 'variables.env'});

exports.TiposTareaGet = async(req, res) => {
    try {
        const tiposTarea = await knex.select('*').from('tipotarea as tt').where({'tt.deletedAt': null});
        res.json(tiposTarea);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al encontrar los tipos de tarea');
    }
}