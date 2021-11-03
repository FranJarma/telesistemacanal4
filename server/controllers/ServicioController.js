const { validationResult } = require('express-validator');
const db = require('../config/connection');
const options =require('./../config/knex');
const Servicio = require('./../models/Servicio');
const knex = require('knex')(options);
require('dotenv').config({path: 'variables.env'});

exports.ServicioCreate = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    if(req.body.ServicioPrecioUnitario <= 0 || req.body.ServicioRecargo <=0) return res.status(400).json({msg: 'El precio unitario y el recargo tienen que ser mayor a 0'});
    try {
        await db.transaction(async(t)=>{
            const ultimoServicio = await Servicio.findOne({
                order: [['ServicioId', 'DESC']]
            });
            let ultimoServicioId = ultimoServicio.ServicioId + 1;
            const servicio = new Servicio(req.body);
            servicio.ServicioId = ultimoServicioId;
            await servicio.save({transaction: t});
            return res.status(200).json({msg: 'El Servicio ha sido registrado correctamente'})
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({msg: 'Hubo un error al registrar el servicio'});
    }
}
exports.ServicioUpdate = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    if(req.body.ServicioPrecioUnitario <= 0 || req.body.ServicioRecargo <=0) return res.status(400).json({msg: 'El precio unitario y el recargo tienen que ser mayor a 0'});
    try {
        await db.transaction(async(t)=>{
            const servicio = await Servicio.findByPk(req.body.ServicioId, {transaction: t});
            await servicio.update(req.body, {transaction: t});
            return res.status(200).json({msg: 'El Servicio ha sido modificado correctamente'})
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({msg: 'Hubo un error al modificar el servicio'});
    }
}
exports.ServicioDelete = async(req, res) => {
    try {
        await db.transaction(async(t)=>{
            const servicio = await Servicio.findByPk(req.body.ServicioId, {transaction: t});
            servicio.ServicioEliminado = 1;
            await servicio.save({transaction: t});
            return res.status(200).json({msg: 'El Servicio ha sido eliminado correctamente'})
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({msg: 'Hubo un error al eliminar el servicio'});
    }
}
exports.ServiciosListar = async(req, res) => {
    try {
        const servicios = await knex.select('*').from('servicio as s').where('s.ServicioEliminado', '=', '0');
        res.json(servicios);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al encontrar los servicios');
    }
}