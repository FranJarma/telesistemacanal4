const db = require('./../config/connection');
const options =require('./../config/knex');
const knex = require('knex')(options);
const { validationResult } = require('express-validator');
const Movimiento = require('../models/Movimiento');

exports.MovimientosGetByFecha = async (req, res) => {
    try {
        const movimientos = await knex.
        select('m.MovimientoId', 'm.MovimientoCantidad', 'm.MovimientoDia', 'm.MovimientoMes', 'm.MovimientoAño', 'm.createdAt', 'u.Nombre as NombreCarga', 'u.Apellido as ApellidoCarga', 'mc.MovimientoConceptoNombre as Concepto')
        .from('movimiento as m')
        .innerJoin('_user as u','u.UserId','=','m.createdBy')
        .innerJoin('movimientoconcepto as mc', 'm.MovimientoConceptoId','=','mc.MovimientoConceptoId')
        .where({
            'm.MovimientoDia': req.params.Dia,
            'm.MovimientoMes': req.params.Mes,
            'm.MovimientoAño': req.params.Anio
        })
        res.json(movimientos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error al encontrar los movimientos del día'});
    }
}