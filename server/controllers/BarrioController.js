const { validationResult } = require('express-validator');
const db = require('../config/connection');
const options =require('./../config/knex');
const Barrio = require('./../models/Barrio');
const knex = require('knex')(options);
require('dotenv').config({path: 'variables.env'});

exports.BarrioCreate = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
        await db.transaction(async(t)=>{
            const barrioBuscar = await Barrio.findOne({
                where: {
                    BarrioNombre: req.body.BarrioNombre,
                    MunicipioId: req.body.MunicipioIdModal
                }
            }
            );
            if (barrioBuscar) return res.status(400).json({msg: 'Ya existe un barrio con ese nombre en ese municipio'});
            const ultimoBarrio = await Barrio.findOne({
                order: [['BarrioId', 'DESC']]
            });
            const barrio = new Barrio(req.body);
            barrio.BarrioId = ultimoBarrio.BarrioId + 1;
            barrio.MunicipioId = req.body.MunicipioIdModal;
            barrio.createdBy = req.body.sessionStorage.getItem('identity');
            await barrio.save({transaction: t});
            return res.status(200).json({msg: 'El Barrio ha sido registrado correctamente'})
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({msg: 'Hubo un error al registrar el barrio'});
    }
}
exports.BarrioUpdate = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
        await db.transaction(async(t)=>{
            const barrio = await Barrio.findByPk(req.body.BarrioId, {transaction: t})
            await barrio.update(req.body, {transaction: t});
            return res.status(200).json({msg: 'El Barrio ha sido modificado correctamente'})
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({msg: 'Hubo un error al modificar el barrio'});
    }
}
exports.BarrioDelete = async(req, res) => {
    try {
        await db.transaction(async(t)=>{
            const barrio = await Barrio.findByPk(req.body.BarrioId, {transaction: t});
            barrio.deletedAt = new Date();
            barrio.deletedBy = req.body.sessionStorage.getItem('identity');
            await barrio.save({transaction: t});
            return res.status(200).json({msg: 'El Barrio ha sido eliminado correctamente'})
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({msg: 'Hubo un error al eliminar el barrio'});
    }
}

exports.BarriosListarPorMunicipio = async(req, res) => {
    try {
        const barrios = await knex.select('*').from('barrio as b').innerJoin('municipio as m','b.MunicipioId', '=', 'm.MunicipioId')
        .where({
            'b.MunicipioId': req.params.id,
            'b.deletedAt': null
        });
        res.json(barrios);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al encontrar los barrios');
    }
}

exports.BarriosGet = async(req, res) => {
    try {
        const barrios = await knex.select('*').from('barrio as b').innerJoin('municipio as m','b.MunicipioId', '=', 'm.MunicipioId')
        .where({'b.deletedAt': null});
        res.json(barrios);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al encontrar los barrios');
    }
}