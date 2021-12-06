const { validationResult } = require('express-validator');
const db = require('../config/connection');
const options =require('./../config/knex');
const Servicio = require('./../models/Servicio');
const knex = require('knex')(options);
require('dotenv').config({path: 'variables.env'});

exports.TareasGet = async(req, res) => {
    try {
        const tareas = await knex.select('*').from('tarea as t')
        .innerJoin('domicilio as d', 't.DomicilioId', '=', 'd.DomicilioId')
        .innerJoin('_user as u', 'u.DomicilioId', '=', 't.DomicilioId')
        .innerJoin('tipotarea as tt', 'tt.TipoTareaId', '=', 't.TipoTareaId')
        .innerJoin('barrio as b', 'b.BarrioId', '=', 'd.BarrioId')
        .innerJoin('municipio as m', 'b.MunicipioId', '=', 'm.MunicipioId')
        .where({'t.deletedAt': null});
        res.json(tareas);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al encontrar las tareas');
    }
}