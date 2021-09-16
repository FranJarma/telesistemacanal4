const db = require('./../config/connection');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('./../models/User');
const UserRole = require('./../models/UserRole');
const UserServicio = require('./../models/UserServicio');

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
        abonado.DomicilioCalle = req.body.domicilioCalle;
        abonado.DomicilioNumero = req.body.domicilioNumero;
        abonado.DomicilioPiso = req.body.domicilioPiso;
        abonado.Phone = req.body.telefono;
        abonado.Email = req.body.email;
        abonado.BarrioId = req.body.barrioSeleccionadoId;
        abonado.MunicipioId = req.body.municipioSeleccionadoId;
        abonado.ProvinciaId = req.body.provinciaSeleccionadaId;
        abonado.ServicioId = req.body.servicioSeleccionadoId;
        abonado.CondicionIVAId = req.body.condicionIVASeleccionadoId;
        const abonadoRole = new UserRole();
        abonadoRole.UserId = abonado.UserId;
        abonadoRole.RoleId = process.env.ID_ROL_ABONADO;
        const abonadoServicio = new UserServicio();
        abonadoServicio.UserId = abonado.UserId;
        abonadoServicio.ServicioId = abonado.ServicioId;
        await db.query('CALL __UserCreate(:UserId, :RoleId, :UserName, :FullName, :Password, :Documento, :Cuit, :DomicilioCalle, :DomicilioNumero, :DomicilioPiso, :Email, :FechaBajada, :FechaContrato, :FechaNacimiento,:Phone, :BarrioId, :MunicipioId, :ProvinciaId, :CondicionIVAId, :ServicioId)',
        {
            replacements: {
                UserId: abonado.UserId,
                RoleId: abonadoRole.RoleId,
                UserName: null,
                Password: null,
                FullName: abonado.FullName,
                Documento: abonado.Documento,
                Cuit: abonado.Cuit,
                DomicilioCalle: abonado.DomicilioCalle,
                DomicilioNumero: abonado.DomicilioNumero,
                DomicilioPiso: abonado.DomicilioPiso,
                Email: abonado.Email,
                FechaBajada: abonado.FechaBajada,
                FechaContrato: abonado.FechaContrato,
                FechaNacimiento: abonado.FechaNacimiento,
                Phone: abonado.Phone,
                BarrioId: abonado.BarrioId,
                MunicipioId: abonado.MunicipioId,
                ProvinciaId: abonado.ProvinciaId,
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