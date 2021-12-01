const { validationResult } = require('express-validator');
const db = require('../config/connection');
const options =require('./../config/knex');
const ModeloOnu = require('./../models/ModeloOnu');
const knex = require('knex')(options);
require('dotenv').config({path: 'variables.env'});

exports.ModelosOnuGet = async(req, res) => {
    try {
        const modelosONU = await knex.select('*').from('modeloonu as mo')
        .where({'mo.deletedAt': null});
        res.json(modelosONU);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al encontrar los modelos de onu');
    }
}

exports.ModeloOnuCreate = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
        await db.transaction(async(t)=>{
            const ultimoModeloOnu = await ModeloOnu.findOne({
                order: [['ModeloOnuId', 'DESC']]
            });
            const modeloOnu = new ModeloOnu(req.body);
            modeloOnu.ModeloOnuId = ultimoModeloOnu.ModeloOnuId + 1;
            await modeloOnu.save({transaction: t});
            return res.status(200).json({msg: 'El modelo de ONU ha sido registrado correctamente'})
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({msg: 'Hubo un error al registrar el modelo de ONU'});
    }
}
exports.ModeloOnuUpdate = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
        await db.transaction(async(t)=>{
            const modeloOnu = await ModeloOnu.findByPk(req.body.ModeloOnuId, {transaction: t});
            await modeloOnu.update(req.body, {transaction: t});
            return res.status(200).json({msg: 'El modelo de ONU ha sido modificado correctamente'})
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({msg: 'Hubo un error al modificar el modelo de ONU'});
    }
}
exports.ModeloOnuDelete = async(req, res) => {
    try {
        await db.transaction(async(t)=>{
            const modeloOnu = await ModeloOnu.findByPk(req.body.ModeloOnuId, {transaction: t});
            await modeloOnu.update(req.body, {transaction: t});
            return res.status(200).json({msg: 'El modelo de ONU ha sido eliminado correctamente'})
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({msg: 'Hubo un error al eliminar el modelo de ONU'});
    }
}