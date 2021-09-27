const db = require('./../config/connection');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('./../models/User');
const Domicilio = require('./../models/Domicilio');
const UserRole = require('./../models/UserRole');
const UserServicio = require('./../models/UserServicio');
const UserDomicilio = require('./../models/UserDomicilio');

require('dotenv').config({path: 'variables.env'});

//FUNCIONES PARA ABONADOS
exports.AbonadosActivosListar = async(req, res) => {
    try {
        const abonados = await db.query(`CALL _AbonadosActivosReadAll();`);
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

exports.AbonadoCreate = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
        //traemos el id del ultimo domicilio registrado
        const ultimoDomicilioId = await db.query('CALL _UltimoDomicilioRead();');
        //creamos un nuevo abonado pasándole como info todo lo que traemos de la vista
        const abonado = new User(req.body);
        abonado.UserId = uuidv4().toUpperCase();
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
        const domicilio = new Domicilio();
        domicilio.DomicilioId = ultimoDomicilioId[0].DomicilioId + 1;
        domicilio.DomicilioCalle = req.body.domicilioCalle;
        domicilio.DomicilioNumero = req.body.domicilioNumero;
        domicilio.DomicilioPiso = req.body.domicilioPiso;
        domicilio.BarrioId = req.body.barrioSeleccionadoId;
        const abonadoDomicilio = new UserDomicilio();
        abonadoDomicilio.UserId = abonado.UserId;
        abonadoDomicilio.DomicilioId = ultimoDomicilioId[0].DomicilioId + 1;
        const abonadoRole = new UserRole();
        abonadoRole.UserId = abonado.UserId;
        abonadoRole.RoleId = process.env.ID_ROL_ABONADO;
        const abonadoServicio = new UserServicio();
        abonadoServicio.UserId = abonado.UserId;
        abonadoServicio.ServicioId = abonado.ServicioId;
        await db.query('CALL __UserCreate(:UserId, :RoleId, :UserName, :FullName, :Password, :Documento, :Cuit, :DomicilioId, :DomicilioCalle, :DomicilioNumero, :DomicilioPiso, :BarrioId, :Email, :FechaBajada, :FechaContrato, :FechaNacimiento,:Phone, :CondicionIVAId, :ServicioId)',
        {
            replacements: {
                UserId: abonado.UserId,
                RoleId: abonadoRole.RoleId,
                UserName: null,
                Password: null,
                FullName: abonado.FullName,
                Documento: abonado.Documento,
                Cuit: abonado.Cuit,
                DomicilioId: domicilio.DomicilioId,
                DomicilioCalle: domicilio.DomicilioCalle,
                DomicilioNumero: domicilio.DomicilioNumero,
                DomicilioPiso: domicilio.DomicilioPiso,
                BarrioId: domicilio.BarrioId,
                Email: abonado.Email,
                FechaBajada: abonado.FechaBajada,
                FechaContrato: abonado.FechaContrato,
                FechaNacimiento: abonado.FechaNacimiento,
                Phone: abonado.Phone,
                CondicionIVAId: abonado.CondicionIVAId,
                ServicioId: abonado.ServicioId
        }
        });
            return res.status(200).json({msg: 'El Abonado ha sido registrado correctamente'})
        }   
    catch (error) {
        console.log(error)
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
        const ultimoDomicilioId = await db.query('CALL _UltimoDomicilioRead();');
        await db.query('CALL __UserCambioDomicilio(:UserId, :DomicilioId, :BarrioId, :DomicilioCalle, :DomicilioNumero, :DomicilioPiso, :CambioDomicilioObservaciones)',
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