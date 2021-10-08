const db = require('./../config/connection');
const options =require('./../config/knex');
const knex = require('knex')(options);
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('./../models/User');
const Domicilio = require('./../models/Domicilio');
const Servicio = require('./../models/Servicio');
const UserDomicilio = require('./../models/UserDomicilio');
const UserEstado = require('./../models/UserEstado');
const UserServicio = require('./../models/UserServicio');
const ModeloOnu = require('./../models/ModeloOnu');
const UserRole = require('./../models/UserRole');
const Onu = require('../models/Onu');

require('dotenv').config({path: 'variables.env'});

//FUNCIONES PARA ABONADOS
exports.AbonadosInscriptosListar = async(req, res) => {
    try {
        const abonados = await knex.select('*').from('_user as u')
        .join('_userrole as ur', 'u.UserId', '=', 'ur.UserId')
        .join('_role as r', 'r.RoleId', '=', 'ur.RoleId')
        .join('servicio as s', 'u.ServicioId', '=', 's.ServicioId')
        .join('domicilio as d', 'd.DomicilioId', 'u.DomicilioId')
        .join('barrio as b', 'b.BarrioId', 'd.BarrioId')
        .join('municipio as m', 'b.MunicipioId', 'm.MunicipioId')
        .leftJoin('onu as o', 'o.OnuId', '=','u.OnuId')
        .leftJoin('modeloonu as mo', 'mo.ModeloOnuId', '=', 'o.ModeloOnuId')
        .where({
            'r.RoleId': process.env.ID_ROL_ABONADO,
            'u.EstadoId': process.env.ESTADO_ID_ABONADO_INSCRIPTO
        });
        res.json(abonados);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al encontrar los abonados');
    }
}
exports.AbonadosActivosListar = async(req, res) => {
    try {
        const abonados = await knex.select('*').from('_user as u')
        .join('_userrole as ur', 'u.UserId', '=', 'ur.UserId')
        .join('_role as r', 'r.RoleId', '=', 'ur.RoleId')
        .join('servicio as s', 'u.ServicioId', '=', 's.ServicioId')
        .join('domicilio as d', 'd.DomicilioId', 'u.DomicilioId')
        .join('barrio as b', 'b.BarrioId', 'd.BarrioId')
        .join('municipio as m', 'b.MunicipioId', 'm.MunicipioId')
        .leftJoin('onu as o', 'o.OnuId', '=','u.OnuId')
        .leftJoin('modeloonu as mo', 'mo.ModeloOnuId', '=', 'o.ModeloOnuId')
        .where({
            'r.RoleId': process.env.ID_ROL_ABONADO,
            'u.EstadoId': process.env.ESTADO_ID_ABONADO_ACTIVO
        });
        res.json(abonados);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al encontrar los abonados');
    }
}

exports.AbonadosInactivosListar = async(req, res) => {
    try {
        const abonados = await knex.select('*').from('_user as u')
        .join('_userrole as ur', 'u.UserId', '=', 'ur.UserId')
        .join('_role as r', 'r.RoleId', '=', 'ur.RoleId')
        .join('servicio as s', 'u.ServicioId', '=', 's.ServicioId')
        .join('domicilio as d', 'd.DomicilioId', 'u.DomicilioId')
        .join('barrio as b', 'b.BarrioId', 'd.BarrioId')
        .join('municipio as m', 'b.MunicipioId', 'm.MunicipioId')
        .join('userestado as ue', 'u.UserId', '=', 'ue.UserId')
        .where({
            'r.RoleId': process.env.ID_ROL_ABONADO,
            'ue.EstadoId': process.env.ESTADO_ID_ABONADO_INACTIVO
        });
        res.json(abonados);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al encontrar los abonados');
    }
}

exports.AbonadoListarDomicilios = async(req, res) => {
    try {
        const domicilios = await knex.select('*').from('userdomicilio as ud')
        .join('_user as u', 'u.UserId', '=', 'ud.UserId')
        .join('domicilio as d', 'd.DomicilioId', '=', 'ud.DomicilioId')
        .join('barrio as b', 'b.BarrioId', '=', 'd.BarrioId')
        .join('municipio as m', 'm.MunicipioId', '=', 'b.MunicipioId')
        .where('ud.UserId', '=', req.params.id)
        .orderBy('ud.CambioDomicilioFecha', 'desc');
        res.json(domicilios);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al encontrar los domicilios de los abonados');
    }
}

exports.AbonadoUltimoDomicilio = async(req, res) => {
    try {
        const domicilio = await db.query('CALL _AbonadoReadUltimoDomicilio(:UserId)',
        {
            replacements: {
                UserId: req.params.id
        }
        });
        res.json(domicilio[0]);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al encontrar el último domicilio del abonado');
    }
}

exports.AbonadoCreate = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    const transaction = await db.transaction();
    try {
        //traemos el id del ultimo domicilio registrado y de la ultima onu registrada
        let ultimoDomicilioId = 0;
        const ultimoDomicilio = await Domicilio.findOne({
            order: [['DomicilioId', 'DESC']],
        });
        if (ultimoDomicilio) ultimoDomicilioId = ultimoDomicilio.DomicilioId;
        // creamos un nuevo abonado pasándole como info todo lo que traemos de la vista
        const abonado = new User(req.body);
        abonado.UserId = uuidv4().toUpperCase();
        abonado.DomicilioId = ultimoDomicilioId + 1;
        abonado.EstadoId = process.env.ESTADO_ID_ABONADO_INSCRIPTO;
        const domicilio = new Domicilio(req.body);
        domicilio.DomicilioId = ultimoDomicilioId + 1;
        const abonadoRole = new UserRole();
        abonadoRole.UserId = abonado.UserId;
        abonadoRole.RoleId = process.env.ID_ROL_ABONADO;
        const abonadoDomicilio = new UserDomicilio(req.body);
        abonadoDomicilio.DomicilioId = ultimoDomicilioId + 1;
        abonadoDomicilio.UserId = abonado.UserId;
        abonadoDomicilio.CambioDomicilioFecha = new Date().toString();
        abonadoDomicilio.CambioDomicilioObservaciones = 'Primer Domicilio';
        const abonadoServicio = new UserServicio();
        abonadoServicio.ServicioId = req.body.ServicioId;
        abonadoServicio.UserId = abonado.UserId;
        abonadoServicio.CambioServicioFecha = new Date().toString();
        abonadoServicio.CambioServicioObservaciones = 'Primer Servicio contratado';
        const abonadoEstado = new UserEstado();
        abonadoEstado.EstadoId = process.env.ESTADO_ID_ABONADO_INSCRIPTO;
        abonadoEstado.UserId = abonado.UserId;
        abonadoEstado.CambioEstadoFecha = new Date().toString();
        abonadoEstado.CambioEstadoObservaciones = 'Primer Inscripción';
        // Si es Cable, no Instanciar ONU
        if(req.body.ServicioId !== 1) {
            let ultimaOnuId = 0;
            // traemos el de la ultima onu registrada
            const ultimaOnu = await Onu.findOne({
                order: [['OnuId', 'DESC']],
                attributes: { exclude: ['createdAt', 'updatedAt']}
            });
            if (ultimaOnu) ultimaOnuId = ultimaOnu.OnuId;
            const onu = new Onu(req.body);
            onu.OnuId = ultimaOnuId + 1;
            abonado.OnuId = ultimaOnuId + 1;
            await onu.save();
        };
        await domicilio.save();
        await abonado.save();
        await abonadoRole.save();
        await abonadoDomicilio.save();
        await abonadoServicio.save();
        await abonadoEstado.save();
        await transaction.commit();
        return res.status(200).json({msg: 'El Abonado ha sido registrado correctamente'})
        }   
    catch (error) {
        console.log(error);
        await transaction.rollback();
        res.status(400).send({msg: 'Hubo un error al registrar el abonado'});
    }
}

exports.AbonadoUpdate = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    const transaction = await db.transaction();
    try {
        //buscamos el abonado por su Id
        const abonado = await User.findByPk( req.body.UserId );
        await abonado.update(req.body);
        await transaction.commit();
        return res.status(200).send({msg: 'El Abonado ha sido modificado correctamente'})
        }   
    catch (error) {
        console.log(error)
        await transaction.rollback();
        res.status(400).send({msg: 'Hubo un error al registrar el abonado'});
    }
}

exports.AbonadoCambiarEstado = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    const transaction = await db.transaction();
    try {
        //buscamos el abonado por su Id
        const abonado = await User.findByPk( req.body.UserId );
        const abonadoEstado = new UserEstado( req.body );
        await abonado.update(req.body);
        await abonadoEstado.save();
        await transaction.commit();
        if(req.body.EstadoId === 2) {
            return res.status(200).json({msg: 'El Abonado ha sido activado correctamente'})
        }
        else if (req.body.EstadoId === 3){
            return res.status(200).json({msg: 'El Abonado ha sido dado de baja correctamente'})
        }
        }   
    catch (error) {
        console.log(error)
        res.status(400).send({msg: 'Hubo un error al dar de baja el abonado'});
    }
}

exports.AbonadoCambioDomicilio = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    const t = await db.transaction();
    try {
        //traemos el id del ultimo domicilio registrado
        let ultimoDomicilioId = 0;
        const ultimoDomicilio = await Domicilio.findOne({
            order: [['DomicilioId', 'DESC']],
        });
        if (ultimoDomicilio) ultimoDomicilioId = ultimoDomicilio.DomicilioId;
        const domicilio = new Domicilio(req.body);
        domicilio.DomicilioId = ultimoDomicilioId + 1;
        //buscamos el usuario para actualizarle el domicilio
        const abonado = await User.findByPk( req.body.UserId );
        abonado.DomicilioId = ultimoDomicilioId + 1;
        //await abonado.update(req.body.DomicilioId);
        const abonadoDomicilio = new UserDomicilio(req.body);
        abonadoDomicilio.DomicilioId = ultimoDomicilioId + 1;
        await domicilio.save(),
        await abonado.save();
        await abonadoDomicilio.save();
        await t.commit();
        return res.status(200).json({msg: 'El domicilio del abonado ha sido cambiado correctamente'})
    } catch (error) {
        console.log(error);
        await t.rollback();
        res.status(400).send({msg: 'Hubo un error al cambiar el domicilio del abonado'});
    }
}

exports.AbonadoCambioServicio = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    const t = await db.transaction();
    try {
        //buscamos el usuario para actualizarle el domicilio
        const abonado = await User.findByPk( req.body.UserId );
        abonado.ServicioId = req.body.ServicioId;
        //await abonado.update(req.body.DomicilioId);
        const abonadoServicio = new UserServicio(req.body);
        abonadoDomicilio.ServicioId = req.body.ServicioId;
        await abonado.save();
        await abonadoServicio.save();
        await t.commit();
        return res.status(200).json({msg: 'El servicio del abonado ha sido cambiado correctamente'})
    } catch (error) {
        console.log(error);
        await t.rollback();
        res.status(400).send({msg: 'Hubo un error al cambiar el servicio del abonado'});
    }
}