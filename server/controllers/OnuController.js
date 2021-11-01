const { validationResult } = require('express-validator');
const db = require('../config/connection');
const options =require('./../config/knex');
const Onu = require('./../models/Onu');
const knex = require('knex')(options);
require('dotenv').config({path: 'variables.env'});


exports.OnuGet = async(req, res) => {
    try {
        const onu = await knex.select('*').from('onu as o')
        .innerJoin('modeloonu as mo','o.ModeloOnuId','=','mo.ModeloOnuId')
        .leftJoin('_user as u','u.OnuId','=','o.OnuId')
        .where('o.OnuEliminada','=',0);
        res.json(onu);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al encontrar las onu');
    }
}

exports.OnuCreate = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
        await db.transaction(async(t)=>{
            const ultimaOnu = await Onu.findOne({
                order: [['OnuId', 'DESC']]
            });
            const onu = new Onu(req.body);
            onu.OnuId = ultimaOnu.OnuId + 1;
            await onu.save({transaction: t});
            return res.status(200).json({msg: 'La ONU ha sido registrado correctamente'})
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({msg: 'Hubo un error al registrar la ONU'});
    }
}
exports.OnuUpdate = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
        await db.transaction(async(t)=>{
            const onu = await Onu.findByPk(req.body.OnuId, {transaction: t});
            await onu.update(req.body, {transaction: t});
            return res.status(200).json({msg: 'La ONU ha sido modificada correctamente'})
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({msg: 'Hubo un error al modificar la ONU'});
    }
}
exports.OnuDelete = async(req, res) => {
    try {
        await db.transaction(async(t)=>{
            const onu = await Onu.findByPk(req.body.OnuId, {transaction: t});
            onu.OnuEliminada = 1;
            await onu.save({transaction: t});
            return res.status(200).json({msg: 'La ONU ha sido eliminada correctamente'})
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({msg: 'Hubo un error al eliminar la ONU'});
    }
}