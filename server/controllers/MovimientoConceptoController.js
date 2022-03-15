const db = require('../config/connection');
const options =require('../config/knex');
const knex = require('knex')(options);
const { validationResult } = require('express-validator');
const MovimientoConcepto = require('../models/MovimientoConcepto');

exports.MovimientosConceptosGet = async (req, res) => {
    try {
        if(req.params.tipo != null) {
            const conceptos = await knex.select('*').from('movimientoconcepto as mc').where({
                'mc.deletedAt': null,
                'mc.MovimientoConceptoTipo': req.params.tipo == 1 ? 'Ingreso' : 'Gasto'
            });
            res.json(conceptos);
        }
        else {
            const conceptosAll = await knex.select('*').from('movimientoconcepto as mc').where({
                'mc.deletedAt': null
            });
            res.json(conceptosAll);
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error al encontrar los conceptos de los movimientos'});
    }
}