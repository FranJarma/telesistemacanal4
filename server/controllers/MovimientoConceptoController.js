const db = require('../config/connection');
const options =require('../config/knex');
const knex = require('knex')(options);
const { validationResult } = require('express-validator');
const MovimientoConcepto = require('../models/MovimientoConcepto');

exports.MovimientosConceptosGet = async (req, res) => {
    try {
        const conceptos = await knex.select('*').from('movimientoconcepto as mc').where({
            'mc.deletedAt': null
        });
        res.json(conceptos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error al encontrar los conceptos de los movimientos'});
    }
}