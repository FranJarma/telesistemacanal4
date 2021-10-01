const db = require('./../config/connection');
const options =require('./../config/knex');
const knex = require('knex')(options);
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('./../models/User');
const Domicilio = require('./../models/Domicilio');
const ModeloOnu = require('./../models/ModeloOnu');
const UserRole = require('./../models/UserRole');
const Onu = require('../models/Onu');

require('dotenv').config({path: 'variables.env'});

//FUNCIONES PARA ABONADOS
exports.AbonadosActivosListar = async(req, res) => {
    try {

        const abonados = await knex.from('domicilio').select("*");
        console.log(abonados);
        res.json(abonados);
    } catch (error) {
        res.status(500).send('Hubo un error al encontrar los abonados');
    }
}

exports.AbonadosInactivosListar = async(req, res) => {
    try {
        const abonados = await db.query('CALL _AbonadosInactivosReadAll();');
        res.json(abonados);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al encontrar los abonados');
    }
}

exports.AbonadoListarDomicilios = async(req, res) => {
    try {
        const domicilios = await db.query('CALL _AbonadoReadDomicilios(:UserId)',
        {
            replacements: {
                UserId: req.params.id
        }
        });
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
    //const transaction = await db.transaction();
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
        abonado.FullName = req.body.Apellido + ',' + req.body.Nombre;
        const domicilio = new Domicilio(req.body);
        domicilio.UserId = abonado.UserId;
        domicilio.DomicilioId = ultimoDomicilioId + 1;
        const abonadoRole = new UserRole();
        abonadoRole.UserId = abonado.UserId;
        abonadoRole.RoleId = process.env.ID_ROL_ABONADO;
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
            onu.OnuId = ultimaOnuId;
            onu.ServicioId = req.body.ServicioId;
        };
        await abonado.save();
        await domicilio.save();
        await abonadoRole.save();
        //await transaction.commit();
            return res.status(200).json({msg: 'El Abonado ha sido registrado correctamente'})
        }   
    catch (error) {
        console.log(error);
        //await transaction.rollback();
        res.status(400).send({msg: 'Hubo un error al registrar el abonado'});
    }
}

exports.AbonadoUpdate = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
        //creamos un nuevo abonado pasándole como info todo lo que traemos de la vista
        const abonado = new User(req.body);
        abonado.UserId = req.body.id;
        abonado.FullName = req.body.apellido + ',' + req.body.nombre;
        abonado.Documento = req.body.dni;
        abonado.Cuit = req.body.cuit;
        abonado.FechaBajada = req.body.fechaBajada;
        abonado.FechaContrato = req.body.fechaContrato;
        abonado.FechaNacimiento = req.body.fechaNacimiento;
        abonado.Phone = req.body.telefono;
        abonado.Email = req.body.email;
        abonado.ServicioId = req.body.servicioSeleccionadoId;
        abonado.CondicionIVAId = req.body.condicionIVASeleccionadoId;
        await db.query('CALL __UserUpdate(:user_id, :UserName, :FullName, :Password, :Documento, :Cuit, :Email, :FechaBajada, :FechaContrato, :FechaNacimiento,:Phone, :CondicionIVAId)',
        {
            replacements: {
                user_id: abonado.UserId,
                UserName: null,
                FullName: abonado.FullName,
                Password: null,
                Documento: abonado.Documento,
                Cuit: abonado.Cuit,
                Email: abonado.Email,
                FechaBajada: abonado.FechaBajada,
                FechaContrato: abonado.FechaContrato,
                FechaNacimiento: abonado.FechaNacimiento,
                Phone: abonado.Phone,
                CondicionIVAId: abonado.CondicionIVAId,
        }
        });
            return res.status(200).json({msg: 'El Abonado ha sido modificado correctamente'})
        }   
    catch (error) {
        console.log(error)
        res.status(400).send({msg: 'Hubo un error al registrar el abonado'});
    }
}

exports.AbonadoDelete = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
        console.log(req.body)
        await db.query('CALL __UserDelete(:user_id, :motivo_baja)',
        {
            replacements: {
                user_id: req.body.idAbonadoBaja,
                motivo_baja: req.body.motivoBaja
        }
        });
            return res.status(200).json({msg: 'El Abonado ha sido dado de baja correctamente'})
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
    try {
        //traemos el id del ultimo domicilio registrado
        const ultimoDomicilioId = await db.query('CALL _UltimoDomicilioIdRead();');
        await db.query('CALL _AbonadoCambioDeDomicilio(:UserId, :DomicilioId, :BarrioId, :DomicilioCalle, :DomicilioNumero, :DomicilioPiso, :CambioDomicilioObservaciones)',
        {
            replacements: {
                UserId: req.body.id,
                DomicilioId: ultimoDomicilioId[0].DomicilioId + 1,
                BarrioId: req.body.barrioSeleccionadoId,
                DomicilioCalle: req.body.domicilioCalle,
                DomicilioNumero: req.body.domicilioNumero,
                DomicilioPiso: req.body.domicilioPiso,
                CambioDomicilioObservaciones: req.body.observacionesCambio
        }
        });
            return res.status(200).json({msg: 'El domicilio del abonado ha sido cambiado correctamente'})
    } catch (error) {
        console.log(error)
        res.status(400).send({msg: 'Hubo un error al cambiar el domicilio del abonado'});
    }
}