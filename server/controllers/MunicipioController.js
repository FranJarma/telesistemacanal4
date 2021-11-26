const { validationResult } = require('express-validator');
const db = require('../config/connection');
const ProvinciaMunicipio = require('../models/ProvinciaMunicipio');
const options =require('./../config/knex');
const Municipio = require('./../models/Municipio');
const knex = require('knex')(options);
require('dotenv').config({path: 'variables.env'});

exports.MunicipioCreate = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
        await db.transaction(async(t)=>{
            const municipioBuscar = await Municipio.findOne({
                where: {
                    MunicipioCodigoPostal: req.body.MunicipioCodigoPostal
                }
            }, {transaction: t})
            if(municipioBuscar) return res.status(400).json({msg: 'Ya existe un municipio con ese codigo postal'});
            const ultimoMunicipio = await Municipio.findOne({
                order: [['MunicipioId', 'DESC']]
            });
            const municipio = new Municipio(req.body);
            municipio.MunicipioId = ultimoMunicipio.MunicipioId + 1;
            municipio.createdBy = req.body.usuarioLogueado.User.UserId;
            const provinciaMunicipio = new ProvinciaMunicipio(req.body);
            provinciaMunicipio.MunicipioId = ultimoMunicipio.MunicipioId + 1;
            provinciaMunicipio.ProvinciaId = req.body.ProvinciaIdModal;
            await municipio.save({transaction: t});
            await provinciaMunicipio.save({transaction: t});
            return res.status(200).json({msg: 'El Municipio ha sido registrado correctamente'})
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({msg: 'Hubo un error al registrar el municipio'});
    }
}
exports.MunicipioUpdate = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
        await db.transaction(async(t)=>{
            const municipio = await Municipio.findByPk(req.body.MunicipioId, {transaction: t});
            const provinciaMunicipio = await ProvinciaMunicipio.findOne({
                where: {
                    ProvinciaId: req.body.ProvinciaIdVieja,
                    MunicipioId: req.body.MunicipioId
                }
            }, {transaction: t});
            provinciaMunicipio.ProvinciaId = req.body.ProvinciaIdModal;
            await municipio.update(req.body, {transaction: t});
            await provinciaMunicipio.save({transaction: t});
            return res.status(200).json({msg: 'El Municipio ha sido modificado correctamente'});
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({msg: 'Hubo un error al modificar el municipio'});
    }
}
exports.MunicipioDelete = async(req, res) => {
    try {
        await db.transaction(async(t)=>{
            const municipio = await Municipio.findByPk(req.body.MunicipioId, {transaction: t});
            await municipio.update(req.body, {transaction: t});
            return res.status(200).json({msg: 'El Municipio ha sido eliminado correctamente'})
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({msg: 'Hubo un error al eliminar el municipio'});
    }
}

exports.MunicipiosListarPorProvincia = async(req, res) => {
    try {
        const municipios = await knex.select('*').from('municipio as m')
        .join('provinciamunicipio as pm', 'm.MunicipioId', '=', 'pm.MunicipioId')
        .join('provincia as p', 'p.ProvinciaId', '=', 'pm.ProvinciaId')
        .where({
            'p.ProvinciaId': req.params.id,
            'm.deletedAt': null
        });
        res.json(municipios);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al encontrar los municipios');
    }
}
exports.MunicipiosGet = async(req, res) => {
    try {
        const municipios = await knex.select('*').from('municipio as m')
        .join('provinciamunicipio as pm', 'm.MunicipioId', '=', 'pm.MunicipioId')
        .join('provincia as p', 'p.ProvinciaId', '=', 'pm.ProvinciaId')
        .where({
            'm.deletedAt': null
        });
        res.json(municipios);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al encontrar los municipios');
    }
}
