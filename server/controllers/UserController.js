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
    console.log(req.params.id);
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

exports.AbonadoCreate = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
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
        domicilio.DomicilioId = uuidv4().toUpperCase();
        domicilio.DomicilioCalle = req.body.domicilioCalle;
        domicilio.DomicilioNumero = req.body.domicilioNumero;
        domicilio.DomicilioPiso = req.body.domicilioPiso;
        domicilio.BarrioId = req.body.barrioSeleccionadoId;
        const abonadoDomicilio = new UserDomicilio();
        abonadoDomicilio.UserId = abonado.UserId;
        abonadoDomicilio.DomicilioId = domicilio.DomicilioId;
        const abonadoRole = new UserRole();
        abonadoRole.UserId = abonado.UserId;
        abonadoRole.RoleId = process.env.ID_ROL_ABONADO;
        const abonadoServicio = new UserServicio();
        abonadoServicio.UserId = abonado.UserId;
        abonadoServicio.ServicioId = abonado.ServicioId;
        await db.query('CALL __UserCreate(:UserId, :RoleId, :UserName, :FullName, :Password, :Documento, :Cuit, :DomicilioId, :DomicilioCalle, :DomicilioNumero, :DomicilioPiso, :Email, :FechaBajada, :FechaContrato, :FechaNacimiento,:Phone, :BarrioId, :MunicipioId, :ProvinciaId, :CondicionIVAId, :ServicioId)',
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
        res.status(400).send({msg: 'Hubo un error al registrar el abonado'});
    }
}

exports.UserEliminar = async(req, res) => {
    res.status(200).send("Eliminar abonado")
}