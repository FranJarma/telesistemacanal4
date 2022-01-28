const db = require('./../config/connection');
const options =require('./../config/knex');
const knex = require('knex')(options);
const { validationResult } = require('express-validator');
const Movimiento = require('../models/Movimiento');
const MovimientoConcepto = require('../models/MovimientoConcepto');

exports.MovimientosGetByFecha = async (req, res) => {
    try {
        const movimientos = await knex.
        select('m.MovimientoId', 'm.MovimientoCantidad', 'm.MovimientoDia', 'm.MovimientoMes', 'm.MovimientoAño', 'm.createdAt', 'u.Nombre as NombreCarga', 'u.Apellido as ApellidoCarga', 'mc.MovimientoConceptoNombre as Concepto', 'mc.MovimientoConceptoTipo as Tipo')
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

exports.MovimientoCreate = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
        await db.transaction(async(t)=>{
            const ultimoMovimiento = await Movimiento.findOne({
                order: [['MovimientoId', 'DESC']]
            });
            let ultimoMovimientoId = ultimoMovimiento.MovimientoId + 1;
            const movimiento = new Movimiento(req.body);
            movimiento.MovimientoId = ultimoMovimientoId;
            movimiento.MovimientoDia = new Date().getDate();
            movimiento.MovimientoMes = new Date().getMonth()+1;
            movimiento.MovimientoAño = new Date().getFullYear();
            const movimientoConcepto = MovimientoConcepto.findByPk(req.body.MovimientoConceptoId, {transaction: t});
            if(movimientoConcepto.MovimientoConceptoTipo === 'Gasto') {
                movimiento.MovimientoCantidad = (-1) * req.body.MovimientoCantidad;
            }
            await movimiento.save({transaction: t});
            return res.status(200).json({msg: 'El Movimiento ha sido registrado correctamente'})
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({msg: 'Hubo un error al registrar el movimiento'});
    }
}