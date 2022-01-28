const { validationResult } = require('express-validator');
const db = require('../config/connection');
const options =require('../config/knex');
const knex = require('knex')(options);
const MedioPago = require('./../models/MedioPago');

require('dotenv').config({path: 'variables.env'});

exports.MedioPagoCreate = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
        await db.transaction(async(t)=>{
            const ultimoMedioPago = await MedioPago.findOne({
                order: [['MedioPagoId', 'DESC']]
            });
            let ultimoMedioPagoId = ultimoMedioPago.MedioPagoId + 1;
            const medioPago = new MedioPago(req.body);
            medioPago.MedioPagoId = ultimoMedioPagoId;
            await medioPago.save({transaction: t});
            return res.status(200).json({msg: 'El Medio de Pago ha sido registrado correctamente'})
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({msg: 'Hubo un error al registrar el medio de pago'});
    }
}
exports.MedioPagoUpdate = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
        await db.transaction(async(t)=>{
            const medioPago = await MedioPago.findByPk(req.body.MedioPagoId, {transaction: t});
            await medioPago.update(req.body, {transaction: t});
            return res.status(200).json({msg: 'El Medio de Pago ha sido modificado correctamente'})
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({msg: 'Hubo un error al modificar el Medio de Pago'});
    }
}
exports.MedioPagoDelete = async(req, res) => {
    try {
        await db.transaction(async(t)=>{
            const medioPago = await MedioPago.findByPk(req.body.MedioPagoId, {transaction: t});
            await medioPago.update(req.body, {transaction: t});
            return res.status(200).json({msg: 'El Medio de Pago ha sido eliminado correctamente'})
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({msg: 'Hubo un error al eliminar el Medio de Pago'});
    }
}

exports.MediosDePagoListar = async(req, res) => {
    try {
        const mediosDePago = await knex.select('*').from('mediopago');
        res.json(mediosDePago);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al encontrar los medios de pago');
    }
}