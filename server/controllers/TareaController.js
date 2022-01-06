const { validationResult } = require('express-validator');
const db = require('../config/connection');
const options =require('./../config/knex');
const Tarea = require('./../models/Tarea');
const knex = require('knex')(options);
require('dotenv').config({path: 'variables.env'});

exports.TareaCreate = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    if(req.body.TareaPrecioUnitario <= 0) return res.status(400).json({msg: 'El precio unitario tiene que ser mayor a 0'});
    try {
        await db.transaction(async(t)=>{
            const ultimaTarea = await Tarea.findOne({
                order: [['TareaId', 'DESC']]
            });
            let ultimaTareaId = ultimaTarea.TareaId + 1;
            const tarea = new Tarea(req.body);
            tarea.TareaId = ultimaTareaId;
            await tarea.save({transaction: t});
            return res.status(200).json({msg: 'La tarea sido registrada correctamente'})
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({msg: 'Hubo un error al registrar la tarea'});
    }
}
exports.TareaUpdate = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    if(req.body.TareaPrecioUnitario <= 0) return res.status(400).json({msg: 'El precio unitario tiene que ser mayor a 0'});
    try {
        await db.transaction(async(t)=>{
            const tarea = await Tarea.findByPk(req.body.TareaId, {transaction: t});
            await tarea.update(req.body, {transaction: t});
            return res.status(200).json({msg: 'La tarea ha sido modificada correctamente'})
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({msg: 'Hubo un error al modificar la tarea'});
    }
}
exports.TareaDelete = async(req, res) => {
    try {
        await db.transaction(async(t)=>{
            const tarea = await Tarea.findByPk(req.body.TareaId, {transaction: t});
            await tarea.update(req.body, {transaction: t});
            return res.status(200).json({msg: 'La tarea ha sido eliminado correctamente'})
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({msg: 'Hubo un error al eliminar la tarea'});
    }
}

exports.TareasGet = async(req, res) => {
    try {
        const tareas = await knex.select('*').from('tarea as t')
        .where({'t.deletedAt': null});
        res.json(tareas);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al encontrar las tareas');
    }
}