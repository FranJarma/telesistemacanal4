const db = require('./../config/connection');
const options =require('./../config/knex');
const knex = require('knex')(options);
const { validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const User = require('./../models/User');
const Pago = require('./../models/Pago');
const DetallePago = require('./../models/DetallePago');
const Domicilio = require('./../models/Domicilio');
const UserDomicilio = require('./../models/UserDomicilio');
const UserEstado = require('./../models/UserEstado');
const UserServicio = require('./../models/UserServicio');
const UserRole = require('./../models/UserRole');
const Movimiento = require('../models/Movimiento');
const MovimientoConcepto = require('../models/MovimientoConcepto');
const Factura = require('../models/Factura');
const Recibo = require('../models/Recibo');
const Barrio = require('./../models/Barrio');
const Municipio = require('../models/Municipio');
const Ot = require('../models/Ot');
const OtTecnico = require('../models/OtTecnico');
const OtTarea = require('../models/OtTarea');
const Onu = require('../models/Onu');
const { Op } = require('sequelize');
const VARIABLES = require('./../config/variables');

const Afip = require('@afipsdk/afip.js');

const date = new Date(Date.now() - ((new Date()).getTimezoneOffset() * 60000)).toISOString().split('T')[0];
const afip = new Afip({ CUIT: 30687336506, cert: "tls_pem.pem", key: "tls_key.key", res_folder: './', production: 'false' });

require('dotenv').config({path: 'variables.env'});

//AUTH Y USERS
exports.UserCreate = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
        await db.transaction(async(t)=>{
            if(req.body.Contraseña && (req.body.Contraseña !== req.body.RContraseña)) return res.status(400).json({msg: 'Las contraseñas no coinciden'});
            let userRoleVec = [];
            // creamos un nuevo user pasandole lo que traemos de la vista
            const user = new User(req.body);
            const salt = bcrypt.genSaltSync();
            user.Contraseña = bcrypt.hashSync(req.body.Contraseña, salt);
            user.UserId = uuidv4().toUpperCase();
            user.EstadoId = VARIABLES.ESTADO_ID_ABONADO_ACTIVO;  // es el mismo estado
            user.EsUsuarioDeSistema = 1;
            //hay que armar un array con todos los objetos a crear
            const userEstado = new UserEstado();
            userEstado.EstadoId = VARIABLES.ESTADO_ID_ABONADO_ACTIVO;
            userEstado.UserId = user.UserId;
            userEstado.CambioEstadoObservaciones = 'Dado de alta';
            await user.save({transaction: t});
            await userEstado.save({transaction: t});
            for (let i=0; i<= req.body.RolesSeleccionados.length-1; i++){
                let obj = {
                    UserId: user.UserId,
                    RoleId: req.body.RolesSeleccionados[i].RoleId
                }
                userRoleVec.push(obj);
                const userRole = new UserRole(obj);
                await userRole.save({transaction: t});
            }
            return res.status(200).json({msg: 'El Usuario ha sido registrado correctamente'})
        })
        }   
    catch (error) {
        console.log(error)
        res.status(400).json({msg: 'Hubo un error al registrar el usuario'});
    }
}
exports.UserUpdate = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
        await db.transaction(async(t)=>{
            if(req.body.Contraseña && (req.body.Contraseña !== req.body.RContraseña)) return res.status(400).json({msg: 'Las contraseñas no coinciden'});
            let userRoleVec = [];
            //buscamos el user por su Id
            const user = await User.findByPk( req.body.UserId, {transaction: t} );
            if(req.body.RolesSeleccionados && req.body.RolesSeleccionados.length !== 0){
                //eliminamos los roles que tiene actualmente el user
                await UserRole.destroy({where: {
                    UserId: req.body.UserId
                }}, {transaction: t});
                //creamos los nuevos roles
                for (let i=0; i<= req.body.RolesSeleccionados.length-1; i++){
                    let obj = {
                        UserId: req.body.UserId,
                        RoleId: req.body.RolesSeleccionados[i].RoleId
                    }
                    userRoleVec.push(obj);
                    const nuevoUserRole = new UserRole(obj);
                    nuevoUserRole.save({transaction: t});
                }
            }
            const salt = bcrypt.genSaltSync();
            req.body.Contraseña ?
            await user.update({
                'Nombre': req.body.Nombre,
                'Apellido': req.body.Apellido,
                'Documento': req.body.Documento,
                'Email': req.body.Email,
                'Telefono': req.body.Telefono,
                'Contraseña': bcrypt.hashSync(req.body.Contraseña, salt),
                'updatedAt': req.body.updatedAt,
                'updatedBy': req.body.updatedBy,
            },{transaction: t})
            : await user.update({
                'Nombre': req.body.Nombre,
                'Apellido': req.body.Apellido,
                'Documento': req.body.Documento,
                'Email': req.body.Email,
                'Telefono': req.body.Telefono,
                'updatedAt': req.body.updatedAt,
                'updatedBy': req.body.updatedBy,
            },{transaction: t});
            return res.status(200).json({msg: 'El Usuario ha sido modificado correctamente'})
        }) 
        }   
    catch (error) {
        console.log(error);
        res.status(400).json({msg: 'Hubo un error al modificar el usuario'});
    }
}
exports.UserDelete = async(req, res) => {
    try {
        await db.transaction(async(t)=>{
            //buscamos el user por su Id
            const user = await User.findByPk( req.body.UserId, {transaction: t} );
            user.DeletedAt = new Date();
            user.DeletedBy = GetUserId();
            await user.save({transaction: t});
            return res.status(200).json({msg: 'El Usuario ha sido eliminado correctamente'})
        })
    }   
    catch (error) {
        res.status(400).json({msg: 'Hubo un error al eliminar el usuario'});
    }
}
exports.UsersGet = async(req, res) => {
    try {
        const users = await knex.select('*').from('_user as u')
        .innerJoin('estado as e', 'u.EstadoId', '=','e.EstadoId')
        .where({'u.EsUsuarioDeSistema': 1});
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error al encontrar los usuarios'});
    }
}
exports.UsersGetByRole = async(req, res) => {
    try {
        const users = await knex.select('u.UserId', 'u.Apellido', 'u.Nombre').from('_userrole as ur')
        .innerJoin('_user as u', 'u.UserId', '=', 'ur.UserId')
        .where({'ur.RoleId': req.params.rolId});
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error al encontrar los usuarios'});
    }
}
exports.UserGetRoles = async(req, res) => {
    try {
        const roles = await knex.select('*').select('e.EstadoNombre').from('_role as r')
        .innerJoin('_userrole as ur','r.RoleId','=', 'ur.RoleId')
        .where('ur.UserId','=',req.body.UserId);
        res.json(roles);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error al encontrar los roles del usuario'});
    }
}
//FUNCIONES PARA ABONADOS
exports.AbonadosGet = async(req, res) => {
    let abonados = '';
    try {
        req.params.municipioId != 0 && req.params.estadoId != 0 ?
        abonados = await knex.select('u.UserId', 'u.AbonadoNumero','u.Nombre', 'u.Apellido', 'u.Documento', 'u.Cuit', 'u.CondicionIvaId', 'u.Email', 'u.FechaNacimiento', 'u.Telefono', 'u.FechaBajada', 'u.FechaVencimientoServicio', 'u.FechaContrato', 'u.deletedAt', 'u1.Nombre as NombreEliminado', 'u1.Apellido as ApellidoEliminado', 'd.DomicilioCalle', 'd.DomicilioNumero', 'd.DomicilioPiso', 'b.BarrioNombre', 'b.BarrioId', 'm.MunicipioNombre', 'm.MunicipioId', 'p.ProvinciaId', 'p.ProvinciaNombre', 's.ServicioId', 's.ServicioNombre', 'o.OnuMac', 'mo.ModeloOnuNombre')
        .from('_user as u')
        .innerJoin('_user as u1', 'u.deletedBy', 'u1.UserId')
        .innerJoin('_userrole as ur', 'u.UserId', '=', 'ur.UserId')
        .innerJoin('_role as r', 'r.RoleId', '=', 'ur.RoleId')
        .leftJoin('servicio as s', 'u.ServicioId', '=', 's.ServicioId')
        .innerJoin('domicilio as d', 'd.DomicilioId', '=', 'u.DomicilioId')
        .innerJoin('barrio as b', 'b.BarrioId', '=', 'd.BarrioId')
        .innerJoin('municipio as m', 'b.MunicipioId', '=', 'm.MunicipioId')
        .innerJoin('provinciamunicipio as pm', 'pm.MunicipioId', '=', 'm.MunicipioId')
        .innerJoin('provincia as p', 'p.ProvinciaId', '=', 'pm.ProvinciaId')
        .leftJoin('onu as o', 'o.OnuId', '=','u.OnuId')
        .leftJoin('modeloonu as mo', 'mo.ModeloOnuId', '=', 'o.ModeloOnuId')
        .where({
            'r.RoleId': VARIABLES.ID_ROL_ABONADO,
            'm.MunicipioId': req.params.municipioId,
            'u.EstadoId': req.params.estadoId
        })
        : req.params.municipioId == 0 && req.params.estadoId != 0 ?
        abonados = await knex.select('u.UserId', 'u.AbonadoNumero','u.Nombre', 'u.Apellido', 'u.Documento', 'u.Cuit', 'u.CondicionIvaId', 'u.Email', 'u.FechaNacimiento', 'u.Telefono', 'u.FechaBajada', 'u.FechaVencimientoServicio', 'u.FechaContrato', 'u.deletedAt', 'u1.Nombre as NombreEliminado', 'u1.Apellido as ApellidoEliminado', 'd.DomicilioCalle', 'd.DomicilioNumero', 'd.DomicilioPiso', 'b.BarrioNombre', 'b.BarrioId', 'm.MunicipioNombre', 'm.MunicipioId', 'p.ProvinciaId', 'p.ProvinciaNombre', 's.ServicioId', 's.ServicioNombre', 'o.OnuMac', 'mo.ModeloOnuNombre')
        .from('_user as u')
        .leftJoin('_user as u1', 'u.deletedBy', 'u1.UserId')
        .innerJoin('_userrole as ur', 'u.UserId', '=', 'ur.UserId')
        .innerJoin('_role as r', 'r.RoleId', '=', 'ur.RoleId')
        .innerJoin('servicio as s', 'u.ServicioId', '=', 's.ServicioId')
        .innerJoin('domicilio as d', 'd.DomicilioId', '=', 'u.DomicilioId')
        .innerJoin('barrio as b', 'b.BarrioId', '=', 'd.BarrioId')
        .innerJoin('municipio as m', 'b.MunicipioId', '=', 'm.MunicipioId')
        .innerJoin('provinciamunicipio as pm', 'pm.MunicipioId', '=', 'm.MunicipioId')
        .innerJoin('provincia as p', 'p.ProvinciaId', '=', 'pm.ProvinciaId')
        .leftJoin('onu as o', 'o.OnuId', '=','u.OnuId')
        .leftJoin('modeloonu as mo', 'mo.ModeloOnuId', '=', 'o.ModeloOnuId')
        .where({
            'r.RoleId': VARIABLES.ID_ROL_ABONADO,
            'u.EstadoId': req.params.estadoId
        })
        : req.params.municipioId != 0 && req.params.estadoId == 0 ?
        abonados = await knex.select('u.UserId', 'u.AbonadoNumero','u.Nombre', 'u.Apellido', 'u.Documento', 'u.Cuit', 'u.CondicionIvaId', 'u.Email', 'u.FechaNacimiento', 'u.Telefono', 'u.FechaBajada', 'u.FechaVencimientoServicio', 'u.FechaContrato', 'u.deletedAt', 'u1.Nombre as NombreEliminado', 'u1.Apellido as ApellidoEliminado', 'd.DomicilioCalle', 'd.DomicilioNumero', 'd.DomicilioPiso', 'b.BarrioNombre', 'b.BarrioId', 'm.MunicipioNombre', 'm.MunicipioId', 'p.ProvinciaId', 'p.ProvinciaNombre', 's.ServicioId', 's.ServicioNombre', 'o.OnuMac', 'mo.ModeloOnuNombre')
        .from('_user as u')
        .innerJoin('_user as u1', 'u.deletedBy', 'u1.UserId')
        .innerJoin('_userrole as ur', 'u.UserId', '=', 'ur.UserId')
        .innerJoin('_role as r', 'r.RoleId', '=', 'ur.RoleId')
        .innerJoin('servicio as s', 'u.ServicioId', '=', 's.ServicioId')
        .innerJoin('domicilio as d', 'd.DomicilioId', '=', 'u.DomicilioId')
        .innerJoin('barrio as b', 'b.BarrioId', '=', 'd.BarrioId')
        .innerJoin('municipio as m', 'b.MunicipioId', '=', 'm.MunicipioId')
        .innerJoin('provinciamunicipio as pm', 'pm.MunicipioId', '=', 'm.MunicipioId')
        .innerJoin('provincia as p', 'p.ProvinciaId', '=', 'pm.ProvinciaId')
        .leftJoin('onu as o', 'o.OnuId', '=','u.OnuId')
        .leftJoin('modeloonu as mo', 'mo.ModeloOnuId', '=', 'o.ModeloOnuId')
        .where({
            'r.RoleId': VARIABLES.ID_ROL_ABONADO,
            'm.MunicipioId': req.params.municipioId,
        })
        : abonados = await knex.select('u.UserId', 'u.AbonadoNumero','u.Nombre', 'u.Apellido', 'u.Documento', 'u.Cuit', 'u.CondicionIvaId', 'u.Email', 'u.FechaNacimiento', 'u.Telefono', 'u.FechaBajada', 'u.FechaVencimientoServicio', 'u.FechaContrato', 'u.deletedAt', 'u1.Nombre as NombreEliminado', 'u1.Apellido as ApellidoEliminado', 'd.DomicilioCalle', 'd.DomicilioNumero', 'd.DomicilioPiso', 'b.BarrioNombre', 'b.BarrioId', 'm.MunicipioNombre', 'm.MunicipioId', 'p.ProvinciaId', 'p.ProvinciaNombre', 's.ServicioId', 's.ServicioNombre', 'o.OnuMac', 'mo.ModeloOnuNombre')
        .from('_user as u')
        .innerJoin('_user as u1', 'u.deletedBy', 'u1.UserId')
        .innerJoin('_userrole as ur', 'u.UserId', '=', 'ur.UserId')
        .innerJoin('_role as r', 'r.RoleId', '=', 'ur.RoleId')
        .innerJoin('servicio as s', 'u.ServicioId', '=', 's.ServicioId')
        .innerJoin('domicilio as d', 'd.DomicilioId', '=', 'u.DomicilioId')
        .innerJoin('barrio as b', 'b.BarrioId', '=', 'd.BarrioId')
        .innerJoin('municipio as m', 'b.MunicipioId', '=', 'm.MunicipioId')
        .innerJoin('provinciamunicipio as pm', 'pm.MunicipioId', '=', 'm.MunicipioId')
        .innerJoin('provincia as p', 'p.ProvinciaId', '=', 'pm.ProvinciaId')
        .leftJoin('onu as o', 'o.OnuId', '=','u.OnuId')
        .leftJoin('modeloonu as mo', 'mo.ModeloOnuId', '=', 'o.ModeloOnuId')
        .where({
            'r.RoleId': VARIABLES.ID_ROL_ABONADO
        })
        res.json(abonados);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error al encontrar los abonados'});
    }
}

exports.AbonadosAtrasadosGet = async(req, res) => {
    try {
        const abonadosAtrasados = await knex.select('u.Nombre','u.Apellido', 'u.Documento',
        'd.DomicilioCalle', 'd.DomicilioNumero', 'b.BarrioNombre', 'm.MunicipioNombre',
        knex.raw('GROUP_CONCAT(p.PagoMes, "/", p.PagoAño SEPARATOR ", ") as MesesDebe'))
        .from('_user as u')
        .innerJoin('domicilio as d', 'd.DomicilioId', '=', 'u.DomicilioId')
        .innerJoin('barrio as b', 'b.BarrioId', 'd.BarrioId')
        .innerJoin('municipio as m', 'm.MunicipioId', 'b.MunicipioId')
        .innerJoin('pago as p', 'p.UserId', '=', 'u.UserId')
        .where('p.PagoSaldo', '>', 0)
        .andWhere('p.PagoMes', '<=', new Date().getMonth()+1)
        .andWhere('p.PagoAño', '<=', new Date().getFullYear())
        .andWhere('u.EstadoId', '!=', 3)
        .groupBy('u.UserId')
        res.json(abonadosAtrasados);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error al encontrar los abonados atrasados'});
    }
}

exports.AbonadoGetById = async(req, res) => {
    try {
        const abonado = await knex.select('u.UserId', 'u.Nombre', 'u.Apellido', 'd.DomicilioCalle', 'd.DomicilioNumero', 'b.BarrioNombre', 'm.MunicipioNombre').from('_user as u')
        .innerJoin('domicilio as d', 'u.DomicilioId', '=', 'd.DomicilioId')
        .innerJoin('barrio as b', 'b.BarrioId', '=', 'd.BarrioId')
        .innerJoin('municipio as m', 'b.MunicipioId', '=', 'm.MunicipioId')
        .where({'u.UserId ': req.params.UserId})
        .first();
        res.json(abonado);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error al encontrar el abonado'});
    }
}
exports.AbonadoListarDomicilios = async(req, res) => {
    try {
        const domicilios = await knex.select('ud.UserDomicilioId', 'ot.OtId',
        'ud.createdAt as FechaPedidoCambio', 'ot.OtFechaInicio as FechaInicioOt',
        'ot.OtFechaPrevistaVisita', 'ot.OtResponsableEjecucion', 'ot.OtFechaFinalizacion',
        'd.DomicilioCalle', 'd.DomicilioNumero', 'b.BarrioId',
        'b.BarrioNombre', 'm.MunicipioId', 'm.MunicipioNombre', 'ud.CambioDomicilioObservaciones')
        .from('userdomicilio as ud')
        .innerJoin('_user as u', 'u.UserId', '=', 'ud.UserId')
        .innerJoin('domicilio as d', 'd.DomicilioId', '=', 'ud.DomicilioId')
        .innerJoin('barrio as b', 'b.BarrioId', '=', 'd.BarrioId')
        .innerJoin('municipio as m', 'm.MunicipioId', '=', 'b.MunicipioId')
        .leftJoin('ot as ot', 'ot.NuevoDomicilioId', '=', 'd.DomicilioId')
        .where('ud.UserId', '=', req.params.id)
        .orderBy('ud.createdAt', 'desc');
        res.json(domicilios);
    } catch (error) {
        res.status(500).json({ msg: 'Hubo un error al encontrar el historial de domicilios del abonado'});
    }
}

exports.AbonadoListarServicios = async(req, res) => {
    try {
        const servicios = await knex.select('us.UserServicioId', 'ot.OtId',
        'us.createdAt as FechaPedidoCambio', 'ot.OtFechaInicio as FechaInicioOt',
        'ot.OtFechaPrevistaVisita', 'ot.OtResponsableEjecucion', 'ot.OtFechaFinalizacion',
        'us.CambioServicioObservaciones','s.ServicioNombre', 'o.OnuMac')
        .from('userservicio as us')
        .innerJoin('servicio as s', 's.ServicioId', '=', 'us.ServicioId')
        .innerJoin('ot as ot', 'ot.OtId', '=', 'us.OtId')
        .leftJoin('onu as o', 'o.OnuId', '=','us.OnuId')
        .where('us.UserId', '=', req.params.id)
        .orderBy('us.createdAt', 'desc');
        res.json(servicios);
    } catch (error) {
        res.status(500).json({ msg: 'Hubo un error al encontrar el historial de servicios del abonado'});
    }
}

exports.AbonadoCreate = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
        await db.transaction(async(t)=>{
        //verificamos que no exista un domicilio con esos datos
        const domicilioBuscar = await knex.select('*').from('domicilio as d')
        .innerJoin('barrio as b', 'd.BarrioId', '=', 'b.BarrioId')
        .innerJoin('municipio as m', 'b.MunicipioId', '=', 'm.MunicipioId')
        .where({
            'd.DomicilioCalle': req.body.DomicilioCalle,
            'd.DomicilioNumero': req.body.DomicilioNumero,
            'd.BarrioId': req.body.Barrio.BarrioId,
            'm.MunicipioId': req.body.MunicipioId
        });

        if(domicilioBuscar.length > 0) {
            return res.status(400).json({msg: 'Ya existe un domicilio registrado en ese barrio y ese municipio'})
        }
        else {
            //traemos el id del ultimo domicilio registrado
            let ultimoDomicilioId = 0;
            const ultimoDomicilio = await Domicilio.findOne({
                order: [['DomicilioId', 'DESC']]
            });
            if (ultimoDomicilio) ultimoDomicilioId = ultimoDomicilio.DomicilioId;
            let ultimaOtRegistradaId = 0;
            //Buscamos la ultima OT registrada
            let ultimaOtRegistrada = await Ot.findOne({
                order: [['OtId', 'DESC']]
            });
            if(ultimaOtRegistrada) ultimaOtRegistradaId = ultimaOtRegistrada.OtId;
            //buscamos el ultimo Movimiento
            let ultimoMovimientoId = 0;
            const ultimoMovimiento = await Movimiento.findOne({
                order: [['MovimientoId', 'DESC']]
            }); 
            if (ultimoMovimiento) ultimoMovimientoId = ultimoMovimiento.MovimientoId;
            //buscamos el ultimo pago
            let ultimoPagoId = 0;
            const ultimoPago = await Pago.findOne({
                order: [['PagoId', 'DESC']]
            }); 
            if (ultimoPago) ultimoPagoId = ultimoPago.PagoId;
            //buscamos el ultimo detalle de pago
            let ultimoDetallePagoId = 0;
            const ultimoDetallePago = await DetallePago.findOne({
                order: [['DetallePagoId', 'DESC']]
            }); 
            if (ultimoDetallePago) ultimoDetallePagoId = ultimoDetallePago.DetallePagoId;
            //buscamos el ultimo numero de abonado
            let ultimoAbonadoNumero = 0;
            const ultimoAbonado = await User.findOne({
                order: [['AbonadoNumero', 'DESC']],
                where: {
                    AbonadoNumero: {
                        [Op.ne]: null
                    }
                }
            }); 
            if (ultimoAbonado) ultimoAbonadoNumero = ultimoAbonado.AbonadoNumero;
            const UserId = uuidv4().toUpperCase();
            // creamos un nuevo abonado pasándole como info todo lo que traemos de la vista
            const abonado = new User(req.body, {transaction: t});
            abonado.AbonadoNumero = ultimoAbonadoNumero + 1;
            abonado.FechaBajada = req.body.OtFechaPrevistaVisita;
            abonado.UserId = UserId;
            abonado.DomicilioId = ultimoDomicilioId + 1;
            abonado.ServicioId = req.body.Servicio.ServicioId;
            abonado.EstadoId = VARIABLES.ESTADO_ID_ABONADO_INSCRIPTO;
            abonado.EsUsuarioDeSistema = 0;
            await abonado.save({transaction: t});
            const domicilio = new Domicilio(req.body, {transaction: t});
            domicilio.DomicilioId = ultimoDomicilioId + 1;
            domicilio.BarrioId = req.body.Barrio.BarrioId;
            const abonadoRole = new UserRole({transaction: t});
            abonadoRole.UserId = abonado.UserId;
            abonadoRole.RoleId = VARIABLES.ID_ROL_ABONADO;
            const abonadoEstado = new UserEstado({transaction: t});
            abonadoEstado.EstadoId = VARIABLES.ESTADO_ID_ABONADO_INSCRIPTO;
            abonadoEstado.UserId = abonado.UserId;
            abonadoEstado.CambioEstadoFecha = new Date();
            abonadoEstado.CambioEstadoObservaciones = 'Dado de alta';
            //instanciamos un nuevo movimiento
            const movimiento = new Movimiento({transaction: t});
            movimiento.MovimientoId = ultimoMovimientoId + 1;
            movimiento.MovimientoCantidad = req.body.MedioPago.MedioPagoId == VARIABLES.ID_MEDIO_PAGO_FACILIDAD ? (req.body.PagoInfo.Total / req.body.MedioPago.MedioPagoCantidadCuotas) : req.body.PagoInfo.Total;
            movimiento.createdBy = req.body.createdBy;
            movimiento.MovimientoDia = new Date().getDate();
            movimiento.MovimientoMes = new Date().getMonth()+1;
            movimiento.MovimientoAño = new Date().getFullYear();
            movimiento.MovimientoConceptoId = VARIABLES.ID_CONCEPTO_INSCRIPCION_ABONADO; //inscripción
            movimiento.MunicipioId = req.body.MunicipioId;
            movimiento.AbonadoId = UserId;
            movimiento.MedioPagoId = req.body.MedioPago.MedioPagoId;
            //registramos un nuevo pago
            const pago = new Pago({transaction: t});
            pago.PagoId = ultimoPagoId + 1;
            pago.UserId = UserId;
            pago.PagoAño = new Date().getFullYear();
            pago.PagoMes = new Date().getMonth() + 1;
            pago.PagoTotal = req.body.PagoInfo.Total;
            pago.PagoRecargo = 0;
            pago.PagoSaldo = req.body.MedioPago.MedioPagoId == VARIABLES.ID_MEDIO_PAGO_FACILIDAD ? (req.body.PagoInfo.Total / req.body.MedioPago.MedioPagoCantidadCuotas) : 0;
            pago.PagoConceptoId = VARIABLES.ID_CONCEPTO_INSCRIPCION_ABONADO;
            pago.createdAt = new Date();
            pago.createdBy = req.body.createdBy;
            await pago.save({transaction: t});
            const detallePago = new DetallePago({transaction: t})
            detallePago.DetallePagoId = ultimoDetallePagoId + 1;
            detallePago.PagoId = pago.PagoId;
            detallePago.MedioPagoId = req.body.MedioPago.MedioPagoId;
            detallePago.createdAt = new Date();
            detallePago.createdBy = req.body.createdBy;
            detallePago.DetallePagoMonto = req.body.MedioPago.MedioPagoId == VARIABLES.ID_MEDIO_PAGO_FACILIDAD ? (req.body.PagoInfo.Total / req.body.MedioPago.MedioPagoCantidadCuotas) : req.body.PagoInfo.Total;
            detallePago.MovimientoId = movimiento.MovimientoId;
            await domicilio.save({transaction: t});
            await abonadoRole.save({transaction: t});
            await abonadoEstado.save({transaction: t});
            await detallePago.save({transaction: t});
            const ot = new Ot(req.body);
            ot.OtId = ultimaOtRegistradaId + 1;
            ot.AbonadoId = UserId;
            ot.EstadoId = VARIABLES.ESTADO_ID_OT_REGISTRADA;
            ot.OtFechaPrevistaVisita = req.body.OtFechaPrevistaVisita;
            ot.OtObservacionesResponsableEmision = req.body.OtObservacionesResponsableEmision;
            ot.OtResponsableEjecucion = req.body.Tecnico.UserId;
            ot.OtEsPrimeraBajada = 1;
            ot.createdBy = req.body.createdBy; 
            await ot.save({transaction: t});
            for (let i=0; i<= req.body.Tecnico.length-1; i++){
                let obj = {
                    TecnicoId: req.body.Tecnico[i].UserId,
                    OtId: ot.OtId,
                    createdBy: req.body.createdBy
                }
                const otTecnico = new OtTecnico(obj);
                await otTecnico.save({transaction: t});
            }
            //Si es cable o internet es una sola tarea
            let objTarea1 = null;
            let objTarea2 = null;
            if(req.body.Servicio.ServicioId === 1 || req.body.Servicio.ServicioId === 2)
            {
                objTarea1 ={
                    OtId: ot.OtId,
                    TareaId: req.body.Servicio.ServicioId === 1 ? 1 : 5, //Bajada cable o bajada internet
                    createdBy: req.body.createdBy
                };
            }
            //si es combo, son dos tareas:
            else {
                objTarea1 = {
                    OtId: ot.OtId,
                    TareaId: 1, //Bajada cable
                    createdBy: req.body.createdBy
                };
                objTarea2 = {
                    OtId: ot.OtId,
                    TareaId: 5, //Bajada internet
                    createdBy: req.body.createdBy
                };
            }
            const otTarea1 = new OtTarea(objTarea1);
            await otTarea1.save({transaction: t});
            if(objTarea2 !== null){
                const otTarea2 = new OtTarea(objTarea2);
                await otTarea2.save({transaction: t});
            }
            const municipio = await Municipio.findOne({
                where: {
                    MunicipioId: req.body.MunicipioId
                }
            })
            const movimientoConceptoNombre = await MovimientoConcepto.findOne({
                where: {
                    MovimientoConceptoId: movimiento.MovimientoConceptoId
                }
            })
            let factura = null;
            let recibo = null;
            let datosFactura = null;
            let datosRecibo = null;
            if(req.body.RequiereFactura){
                let ultimaFacturaId = 0;
                //Buscamos la ultima Factura
                const ultimaFactura = await Factura.findOne({
                    order: [['FacturaId', 'DESC']]
                });
                if (ultimaFactura) ultimaFacturaId = ultimaFactura.FacturaId;
                const data  = {
                    'CantReg' 		: 1, // Cantidad de comprobantes a registrar
                    'PtoVta' 		: 3, // Punto de venta
                    'CbteTipo' 		: 6, // Tipo de comprobante (ver tipos disponibles). (6)Factura B
                    'Concepto' 		: 2, // Concepto del Comprobante: (1)Productos, (2)Servicios, (3)Productos y Servicios
                    'DocTipo' 		: 80, // Tipo de documento del comprador (ver tipos disponibles). (80)CUIT
                    'DocNro' 		: 20405245125, // Numero de documento del comprador
                    'CbteFch' 		: parseInt(date.replace(/-/g, '')), // (Opcional) Fecha del comprobante (yyyymmdd) o fecha actual si es nulo
                    'FchServDesde'  : parseInt(date.replace(/-/g, '')), // (Opcional) Fecha de inicio del servicio (yyyymmdd), obligatorio para Concepto 2 y 3
                    'FchServHasta'  : parseInt(date.replace(/-/g, '')), // (Opcional) Fecha de fin del servicio (yyyymmdd), obligatorio para Concepto 2 y 3
                    'FchVtoPago'    : parseInt(date.replace(/-/g, '')), // (Opcional) Fecha de vencimiento del servicio (yyyymmdd), obligatorio para Concepto 2 y 3
                    'ImpTotal' 		: req.body.PagoInfo.DetallePagoMonto, // Importe total del comprobante
                    'ImpTotConc' 	: req.body.PagoInfo.DetallePagoMonto, // Importe neto no gravado
                    'MonId' 		: 'PES', //Tipo de moneda usada en el comprobante (ver tipos disponibles)('PES' para pesos argentinos) 
                    'MonCotiz' 		: 1, // Cotización de la moneda usada (1 para pesos argentinos)  
                }
                const nuevoComprobante = await afip.ElectronicBilling.createNextVoucher(data, true);
                factura = new Factura({transaction: t});
                factura.FacturaId = ultimaFacturaId + 1;
                factura.FacturaNumeroComprobante = nuevoComprobante.voucherNumber;
                factura.FacturaCodigoAutorizacion = nuevoComprobante.CAE;
                factura.FacturaFechaVencimientoCodigoAutorizacion = nuevoComprobante.CAEFchVto;
                factura.FacturaTipoCodigoAutorizacion = "E";
                factura.FacturaImporte = req.body.MedioPago.MedioPagoId == VARIABLES.ID_MEDIO_PAGO_FACILIDAD ? (req.body.PagoInfo.Total / req.body.MedioPago.MedioPagoCantidadCuotas) : req.body.PagoInfo.Total;
                factura.FacturaVersion = 1;
                factura.FacturaCuitEmisor = afip.CUIT;
                factura.FacturaPuntoVenta = 1;
                factura.FacturaFechaEmision = date;
                factura.FacturaTipoComprobante = 6;
                factura.FacturaMoneda = "PES";
                factura.FacturaCotizacion = 1;
                factura.FacturaTipoDocReceptor = 80;
                factura.FacturaNroDocReceptor = 20405245125;
                factura.FacturaAño = new Date().getFullYear();
                factura.FacturaMes = new Date().getMonth() + 1;
                factura.AbonadoId = abonado.UserId;
                factura.createdAt = new Date();
                factura.createdBy = req.body.PagoInfo.createdBy;
                await factura.save({transaction: t});
                movimiento.FacturaId = factura.FacturaId;
                datosFactura = {FacturaId: factura.FacturaId, FacturaNumeroComprobante: factura.FacturaNumeroComprobante,
                    FacturaCodigoAutorizacion: factura.FacturaCodigoAutorizacion, FacturaFechaVencimientoCodigoAutorizacion: factura.FacturaFechaVencimientoCodigoAutorizacion,
                    FacturaTipoCodigoAutorizacion: factura.FacturaTipoCodigoAutorizacion, FacturaImporte: factura.FacturaImporte,
                    FacturaVersion: factura.FacturaVersion, FacturaCuitEmisor: factura.FacturaCuitEmisor, FacturaPuntoVenta: factura.FacturaPuntoVenta,
                    FacturaFechaEmision: factura.FacturaFechaEmision, FacturaTipoComprobante: factura.FacturaTipoComprobante,
                    FacturaMoneda: factura.FacturaMoneda, FacturaCotizacion: factura.FacturaCotizacion, FacturaTipoDocReceptor: factura.FacturaTipoDocReceptor,
                    FacturaNroDocReceptor: factura.FacturaNroDocReceptor, FacturaAño: factura.FacturaAño, FacturaMes: factura.FacturaMes,
                    AbonadoId: factura.AbonadoId, createdAt: factura.createdAt, createdBy: factura.createdBy,
                    ApellidoAbonado: abonado.Apellido, NombreAbonado: abonado.Nombre,
                    DomicilioCalle: domicilio.DomicilioCalle, DomicilioNumero: domicilio.DomicilioNumero,
                    BarrioNombre: req.body.Barrio.BarrioNombre, MunicipioNombre: municipio.MunicipioNombre, 
                    MovimientoConceptoId: movimiento.MovimientoConceptoId, MovimientoConceptoNombre: movimientoConceptoNombre.MovimientoConceptoNombre, MovimientoCantidad: movimiento.MovimientoCantidad    
                }
            }
            else {
                let ultimoReciboId = 0;
                //Buscamos el ultimo Recibo
                const ultimoRecibo = await Recibo.findOne({
                    order: [['ReciboId', 'DESC']]
                });
                if (ultimoRecibo) ultimoReciboId = ultimoRecibo.ReciboId;
                recibo = new Recibo({transaction: t});
                recibo.ReciboId = ultimoReciboId + 1;
                recibo.ReciboImporte = req.body.MedioPago.MedioPagoId == VARIABLES.ID_MEDIO_PAGO_FACILIDAD ? (req.body.PagoInfo.Total / req.body.MedioPago.MedioPagoCantidadCuotas) : req.body.PagoInfo.Total;
                recibo.createdAt = new Date();
                recibo.createdBy = req.body.PagoInfo.createdBy;
                await recibo.save({transaction: t});
                movimiento.ReciboId = recibo.ReciboId;
                datosRecibo = {ReciboId: recibo.ReciboId, createdAt: recibo.createdAt,
                    ApellidoAbonado: abonado.Apellido, NombreAbonado: abonado.Nombre, Cuit: abonado.Cuit, AbonadoNumero: abonado.AbonadoNumero,
                    DomicilioCalle: domicilio.DomicilioCalle, DomicilioNumero: domicilio.DomicilioNumero,
                    BarrioNombre: req.body.Barrio.BarrioNombre, MunicipioNombre: municipio.MunicipioNombre, 
                    MovimientoConceptoId: movimiento.MovimientoConceptoId, MovimientoConceptoNombre: movimientoConceptoNombre.MovimientoConceptoNombre, MovimientoCantidad: movimiento.MovimientoCantidad    
                }
            }
            await movimiento.save({transaction: t});
            return res.status(200).json({msg: 'El Abonado ha sido registrado correctamente', factura: datosFactura, recibo: datosRecibo});
        }
        }
    )
}   
    catch (error) {
        console.log(error)
        res.status(400).json({msg: 'Hubo un error al registrar el abonado'});
    }
}

exports.AbonadoUpdate = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
        await db.transaction(async(t)=>{
            //buscamos el abonado por su Id
            const abonado = await User.findByPk( req.body.UserId, {transaction: t} );
            //buscamos el domicilio para modificar sus datos en casos de que sea necesario
            const domicilio = await Domicilio.findOne({
                where: {
                    DomicilioId: abonado.DomicilioId
                }
            });
            domicilio.DomicilioCalle = req.body.DomicilioCalle;
            domicilio.DomicilioNumero = req.body.DomicilioNumero;
            domicilio.DomicilioPiso = req.body.DomicilioPiso;
            domicilio.BarrioId = req.body.Barrio.BarrioId;
            await abonado.update(req.body, {transaction: t});
            await domicilio.save({transaction: t});
            return res.status(200).json({msg: 'El Abonado ha sido modificado correctamente'})
        })
        }   
    catch (error) {
        console.log(error);
        res.status(400).json({msg: 'Hubo un error al modificar el abonado'});
    }
}

exports.AbonadoCambiarEstado = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
        await db.transaction(async(t)=>{
            //buscamos el abonado por su Id
            const abonado = await User.findByPk( req.body.UserId, {transaction: t});
            const abonadoEstado = new UserEstado( req.body, {transaction: t});
            //Si el abonado tiene ONU asignada y lo damos de baja, desasignamos su ONU
            if(abonado.OnuId && req.body.EstadoId === 3){
                const onu = await Onu.findOne({
                    where: {
                        OnuId: abonado.OnuId
                    }
                }, { transaction: t});
                abonado.OnuId = null;
                onu.EstadoId = 5;
                await onu.save({transaction: t});
            }
            abonado.EstadoId = req.body.AbonadoId;
            await abonado.save({transaction: t});
            await abonadoEstado.save({transaction: t});
            if(req.body.EstadoId === 1) {
                return res.status(200).json({msg: 'El Abonado ha sido inscripto correctamente'})
            }
            else if (req.body.EstadoId === 2){
                return res.status(200).json({msg: 'El Abonado ha sido activado correctamente'})
            }
            else if (req.body.EstadoId === 3){
                return res.status(200).json({msg: 'El Abonado ha sido dado de baja correctamente'})
            }
        })
        }   
    catch (error) {
        console.log(error);
        res.status(400).json({msg: 'Hubo un error al dar de baja el abonado'});
    }
}

exports.AbonadoRenovarContrato = async(req, res) => {
    try {
        await db.transaction(async(t)=>{
            //buscamos el abonado por su Id
            const abonado = await User.findByPk( req.body.UserId, {transaction: t});
            abonado.FechaContrato = new Date();
            abonado.FechaVencimientoServicio = new Date(new Date().setFullYear(new Date().getFullYear() + 2));
            await abonado.save({transaction: t});
            return res.status(200).json({msg: 'El contrato del abonado ha sido renovado correctamente'})
        })
        }   
    catch (error) {
        console.log(error);
        res.status(400).json({msg: 'Hubo un error al renovar el contrato del abonado'});
    }
}

exports.AbonadoCambioDomicilio = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
        await db.transaction(async(t)=>{
            const abonado = await User.findByPk(req.body.UserId, {transaction: t});
            //verificamos que no exista una OT con cambio de domicilio pendiente
            const otCambioDomicilioExistente = await Ot.findOne({
                where: {
                    AbonadoId: abonado.UserId,
                    NuevoDomicilioId: {
                        [Op.ne]: null
                    },
                    EstadoId: VARIABLES.ESTADO_ID_OT_REGISTRADA
                },
                order: [['OtId', 'DESC']]
            });
            if(otCambioDomicilioExistente) {
                return res.status(400).json({msg: `Ya existe un cambio de domicilio realizado y con una OT pendiente de finalización (N°:${otCambioDomicilioExistente.OtId}). Por favor, finalícela antes de poder registrar un nuevo cambio de domicilio.`});
            }
            // traemos el id del ultimo domicilio registrado
            let ultimoDomicilioId = 0;
            const ultimoDomicilio = await Domicilio.findOne({
                order: [['DomicilioId', 'DESC']],
            });
            if (ultimoDomicilio) ultimoDomicilioId = ultimoDomicilio.DomicilioId;
            let ultimaOtRegistradaId = 0;
            //Buscamos la ultima OT registrada
            let ultimaOtRegistrada = await Ot.findOne({
                order: [['OtId', 'DESC']]
            });
            if (ultimaOtRegistrada) ultimaOtRegistradaId = ultimaOtRegistrada.OtId;
            //buscamos el ultimo pago
            let ultimoPagoId = 0;
            const ultimoPago = await Pago.findOne({
                order: [['PagoId', 'DESC']]
            }); 
            if (ultimoPago) ultimoPagoId = ultimoPago.PagoId;
            //buscamos el ultimo detalle de pago
            let ultimoDetallePagoId = 0;
            const ultimoDetallePago = await DetallePago.findOne({
                order: [['DetallePagoId', 'DESC']]
            }); 
            if (ultimoDetallePago) ultimoDetallePagoId = ultimoDetallePago.DetallePagoId;
            // buscamos el ultimo Movimiento
            let ultimoMovimientoId = 0;
            const ultimoMovimiento = await Movimiento.findOne({
                order: [['MovimientoId', 'DESC']]
            }); 
            if (ultimoMovimiento) ultimoMovimientoId = ultimoMovimiento.MovimientoId;
            const domicilio = new Domicilio(req.body, {transaction: t});
            domicilio.createdAt = new Date();
            domicilio.DomicilioId = ultimoDomicilioId + 1;
            domicilio.BarrioId = req.body.Barrio.BarrioId;
            let ultimoUserDomicilio = await UserDomicilio.findOne({
                order: [["UserDomicilioId", "DESC"]]
            })
            // instanciamos un movimiento
            const movimiento = new Movimiento({transaction: t});
            movimiento.MovimientoId = ultimoMovimientoId + 1;
            movimiento.MovimientoCantidad = req.body.PagoInfo.Total;
            movimiento.createdBy = req.body.createdBy;
            movimiento.MovimientoDia = new Date().getDate();
            movimiento.MovimientoMes = new Date().getMonth()+1;
            movimiento.MovimientoAño = new Date().getFullYear();
            movimiento.MovimientoConceptoId = 5; //cambio de domicilio
            movimiento.MunicipioId = req.body.Municipio.MunicipioId;
            movimiento.AbonadoId = abonado.UserId;
            movimiento.MedioPagoId = req.body.MedioPago.MedioPagoId;
            //registramos un nuevo pago
            const pago = new Pago({transaction: t});
            pago.PagoId = ultimoPagoId + 1;
            pago.UserId = abonado.UserId;
            pago.PagoAño = new Date().getFullYear();
            pago.PagoMes = new Date().getMonth() + 1;
            pago.PagoTotal = req.body.PagoInfo.Total;
            pago.PagoRecargo = 0;
            pago.PagoSaldo = 0;
            pago.PagoConceptoId = 5;
            pago.createdAt = new Date();
            pago.createdBy = req.body.createdBy;
            const detallePago = new DetallePago({transaction: t})
            detallePago.DetallePagoId = ultimoDetallePagoId + 1;
            detallePago.PagoId = ultimoPagoId + 1;
            detallePago.MedioPagoId = req.body.MedioPago.MedioPagoId;
            detallePago.createdAt = new Date();
            detallePago.createdBy = req.body.createdBy;
            detallePago.DetallePagoMonto = req.body.PagoInfo.Total;
            detallePago.MovimientoId = movimiento.MovimientoId;
            const ot = new Ot(req.body);
            ot.OtId = ultimaOtRegistradaId + 1;
            ot.AbonadoId = req.body.UserId;
            ot.EstadoId = VARIABLES.ESTADO_ID_OT_REGISTRADA;
            ot.OtFechaPrevistaVisita = req.body.OtFechaPrevistaVisita;
            ot.OtObservacionesResponsableEmision = req.body.OtObservacionesResponsableEmision;
            ot.OtResponsableEjecucion = req.body.Tecnico.UserId;
            ot.NuevoDomicilioId = domicilio.DomicilioId;
            ot.createdBy = req.body.createdBy; 
            await ot.save({transaction: t});
            const abonadoDomicilio = new UserDomicilio(req.body, {transaction: t});
            abonadoDomicilio.UserDomicilioId = ultimoUserDomicilio.UserDomicilioId + 1;
            abonadoDomicilio.createdAt = new Date();
            abonadoDomicilio.DomicilioId = ultimoDomicilioId + 1;
            abonadoDomicilio.OtId = ot.OtId;
            abonadoDomicilio.createdBy = req.body.createdBy;
            abonadoDomicilio.CambioDomicilioObservaciones = 'Esperando finalización de OT. Una vez finalizada, este pasará a ser el nuevo domicilio del abonado';
            for (let i=0; i<= req.body.Tecnico.length-1; i++){
                let obj = {
                    TecnicoId: req.body.Tecnico[i].UserId,
                    OtId: ot.OtId,
                    createdBy: req.body.createdBy
                }
                const otTecnico = new OtTecnico(obj);
                await otTecnico.save({transaction: t});
            }
            const otTarea = new OtTarea({
                TareaId: abonado.ServicioId = 1 ? 14 : 15, //Cambio de Domicilio
                OtId: ot.OtId,
                createdBy: req.body.createdBy
            });
            await pago.save({transaction: t});
            await detallePago.save({transaction: t});
            await otTarea.save({transaction: t});
            await domicilio.save({transaction: t}),
            await abonadoDomicilio.save({transaction: t});
            let factura = null;
            let recibo = null;
            let datosFactura = null;
            let datosRecibo = null;
            const abonadoDomicilioViejo = await Domicilio.findOne({
                where: {
                    DomicilioId: abonado.DomicilioId
                }
            })
            const barrioDomicilioViejo = await Barrio.findOne({
                where: {
                    BarrioId: abonadoDomicilioViejo.BarrioId
                }
            })
            const municipioDomicilioViejo = await Municipio.findOne({
                where: {
                    MunicipioId: barrioDomicilioViejo.MunicipioId
                }
            })
            const movimientoConceptoNombre = await MovimientoConcepto.findOne({
                where: {
                    MovimientoConceptoId: movimiento.MovimientoConceptoId
                }
            })
            if(req.body.RequiereFactura){
                let ultimaFacturaId = 0;
                //Buscamos la ultima Factura
                const ultimaFactura = await Factura.findOne({
                    order: [['FacturaId', 'DESC']]
                });
                if (ultimaFactura) ultimaFacturaId = ultimaFactura.FacturaId;
                const data  = {
                    'CantReg' 		: 1, // Cantidad de comprobantes a registrar
                    'PtoVta' 		: 3, // Punto de venta
                    'CbteTipo' 		: 6, // Tipo de comprobante (ver tipos disponibles). (6)Factura B
                    'Concepto' 		: 2, // Concepto del Comprobante: (1)Productos, (2)Servicios, (3)Productos y Servicios
                    'DocTipo' 		: 80, // Tipo de documento del comprador (ver tipos disponibles). (80)CUIT
                    'DocNro' 		: 20405245125, // Numero de documento del comprador
                    'CbteFch' 		: parseInt(date.replace(/-/g, '')), // (Opcional) Fecha del comprobante (yyyymmdd) o fecha actual si es nulo
                    'FchServDesde'  : parseInt(date.replace(/-/g, '')), // (Opcional) Fecha de inicio del servicio (yyyymmdd), obligatorio para Concepto 2 y 3
                    'FchServHasta'  : parseInt(date.replace(/-/g, '')), // (Opcional) Fecha de fin del servicio (yyyymmdd), obligatorio para Concepto 2 y 3
                    'FchVtoPago'    : parseInt(date.replace(/-/g, '')), // (Opcional) Fecha de vencimiento del servicio (yyyymmdd), obligatorio para Concepto 2 y 3
                    'ImpTotal' 		: req.body.PagoInfo.DetallePagoMonto, // Importe total del comprobante
                    'ImpTotConc' 	: req.body.PagoInfo.DetallePagoMonto, // Importe neto no gravado
                    'MonId' 		: 'PES', //Tipo de moneda usada en el comprobante (ver tipos disponibles)('PES' para pesos argentinos) 
                    'MonCotiz' 		: 1, // Cotización de la moneda usada (1 para pesos argentinos)  
                }
                const nuevoComprobante = await afip.ElectronicBilling.createNextVoucher(data, true);
                factura = new Factura({transaction: t});
                factura.FacturaId = ultimaFacturaId + 1;
                factura.FacturaNumeroComprobante = nuevoComprobante.voucherNumber;
                factura.FacturaCodigoAutorizacion = nuevoComprobante.CAE;
                factura.FacturaFechaVencimientoCodigoAutorizacion = nuevoComprobante.CAEFchVto;
                factura.FacturaTipoCodigoAutorizacion = "E";
                factura.FacturaImporte = req.body.PagoInfo.Total;
                factura.FacturaVersion = 1;
                factura.FacturaCuitEmisor = afip.CUIT;
                factura.FacturaPuntoVenta = 1;
                factura.FacturaFechaEmision = date;
                factura.FacturaTipoComprobante = 6;
                factura.FacturaMoneda = "PES";
                factura.FacturaCotizacion = 1;
                factura.FacturaTipoDocReceptor = 80;
                factura.FacturaNroDocReceptor = 20405245125;
                factura.FacturaAño = new Date().getFullYear();
                factura.FacturaMes = new Date().getMonth() + 1;
                factura.AbonadoId = abonado.UserId;
                factura.createdAt = new Date();
                factura.createdBy = req.body.createdBy;
                movimiento.FacturaId = factura.FacturaId;
                await factura.save({transaction: t});
                datosFactura = {FacturaId: factura.FacturaId, FacturaNumeroComprobante: factura.FacturaNumeroComprobante,
                    FacturaCodigoAutorizacion: factura.FacturaCodigoAutorizacion, FacturaFechaVencimientoCodigoAutorizacion: factura.FacturaFechaVencimientoCodigoAutorizacion,
                    FacturaTipoCodigoAutorizacion: factura.FacturaTipoCodigoAutorizacion, FacturaImporte: factura.FacturaImporte,
                    FacturaVersion: factura.FacturaVersion, FacturaCuitEmisor: factura.FacturaCuitEmisor, FacturaPuntoVenta: factura.FacturaPuntoVenta,
                    FacturaFechaEmision: factura.FacturaFechaEmision, FacturaTipoComprobante: factura.FacturaTipoComprobante,
                    FacturaMoneda: factura.FacturaMoneda, FacturaCotizacion: factura.FacturaCotizacion, FacturaTipoDocReceptor: factura.FacturaTipoDocReceptor,
                    FacturaNroDocReceptor: factura.FacturaNroDocReceptor, FacturaAño: factura.FacturaAño, FacturaMes: factura.FacturaMes,
                    AbonadoId: factura.AbonadoId, createdAt: factura.createdAt, createdBy: factura.createdBy,
                    ApellidoAbonado: abonado.Apellido, NombreAbonado: abonado.Nombre,
                    DomicilioCalle: abonadoDomicilioViejo.DomicilioCalle, DomicilioNumero: abonadoDomicilioViejo.DomicilioNumero,
                    BarrioNombre: barrioDomicilioViejo.BarrioNombre, MunicipioNombre: municipioDomicilioViejo.MunicipioNombre,
                    MovimientoConceptoId: movimiento.MovimientoConceptoId, MovimientoConceptoNombre: movimientoConceptoNombre.MovimientoConceptoNombre, MovimientoCantidad: movimiento.MovimientoCantidad    
                }
            }
            else {
                let ultimoReciboId = 0;
                //Buscamos el ultimo Recibo
                const ultimoRecibo = await Recibo.findOne({
                    order: [['ReciboId', 'DESC']]
                });
                if (ultimoRecibo) ultimoReciboId = ultimoRecibo.ReciboId;
                recibo = new Recibo({transaction: t});
                recibo.ReciboId = ultimoReciboId + 1;
                recibo.ReciboImporte = req.body.MedioPago.MedioPagoId == VARIABLES.ID_MEDIO_PAGO_FACILIDAD ? (req.body.PagoInfo.Total / req.body.MedioPago.MedioPagoCantidadCuotas) : req.body.PagoInfo.Total;
                recibo.createdAt = new Date();
                recibo.createdBy = req.body.PagoInfo.createdBy;
                await recibo.save({transaction: t});
                movimiento.ReciboId = recibo.ReciboId;
                datosRecibo = {ReciboId: recibo.ReciboId, createdAt: recibo.createdAt,
                    ApellidoAbonado: abonado.Apellido, NombreAbonado: abonado.Nombre, Cuit: abonado.Cuit, AbonadoNumero: abonado.AbonadoNumero,
                    DomicilioCalle: abonadoDomicilioViejo.DomicilioCalle, DomicilioNumero: abonadoDomicilioViejo.DomicilioNumero,
                    BarrioNombre: barrioDomicilioViejo.BarrioNombre, MunicipioNombre: municipioDomicilioViejo.MunicipioNombre,
                    MovimientoConceptoId: movimiento.MovimientoConceptoId, MovimientoConceptoNombre: movimientoConceptoNombre.MovimientoConceptoNombre, MovimientoCantidad: movimiento.MovimientoCantidad    
                }
            }
            await movimiento.save({transaction: t});
            return res.status(200).json({msg: 'El cambio de domicilio ha sido registrado correctamente', factura: datosFactura, recibo: datosRecibo})
        })

    } catch (error) {
        console.log(error);
        res.status(400).json({msg: 'Hubo un error al cambiar el domicilio del abonado'});
    }
}

exports.AbonadoCambioServicio = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
        await db.transaction(async(t)=>{
            const abonado = await User.findByPk( req.body.UserId, {transaction: t} );
            //verificamos que no exista una OT con cambio de servicio pendiente
            const otCambioServicioExistente = await Ot.findOne({
                where: {
                    AbonadoId: abonado.UserId,
                    NuevoServicioId: {
                        [Op.ne]: null
                    },
                    EstadoId: VARIABLES.ESTADO_ID_OT_REGISTRADA
                },
                order: [['OtId', 'DESC']]
            });
            if(otCambioServicioExistente) {
                return res.status(400).json({msg: `Ya existe un cambio de servicio realizado y con una OT pendiente de finalización (N°:${otCambioServicioExistente.OtId}). Por favor, finalícela antes de poder registrar un nuevo cambio de servicio.`});
            }
            //buscamos el user para verificar que no le cambie el servicio al que ya tiene
            if (abonado.ServicioId === req.body.Servicio.ServicioId){
                return res.status(400).json({msg: 'Seleccione un servicio diferente al que ya tiene el abonado actualmente'});
            }
            else {
            abonado.FechaContrato = new Date();
            let ultimoUserServicioId = 0;
            let ultimoUserServicio = await UserServicio.findOne({
                order: [["UserServicioId", "DESC"]]
            })
            if (ultimoUserServicio) ultimoUserServicioId = ultimoUserServicio.UserServicioId;
            //Buscamos la ultima OT registrada
            let ultimaOtRegistradaId = 0;
            let ultimaOtRegistrada = await Ot.findOne({
                order: [['OtId', 'DESC']]
            });
            if (ultimaOtRegistrada) ultimaOtRegistradaId = ultimaOtRegistrada.OtId;
            //buscamos el ultimo pago
            let ultimoPagoId = 0;
            const ultimoPago = await Pago.findOne({
                order: [['PagoId', 'DESC']]
            }); 
            if (ultimoPago) ultimoPagoId = ultimoPago.PagoId;
            //buscamos el ultimo detalle de pago
            let ultimoDetallePagoId = 0;
            const ultimoDetallePago = await DetallePago.findOne({
                order: [['DetallePagoId', 'DESC']]
            }); 
            if (ultimoDetallePago) ultimoDetallePagoId = ultimoDetallePago.DetallePagoId;
            // buscamos el ultimo Movimiento
            let ultimoMovimientoId = 0;
            const ultimoMovimiento = await Movimiento.findOne({
                order: [['MovimientoId', 'DESC']]
            }); 
            if (ultimoMovimiento) ultimoMovimientoId = ultimoMovimiento.MovimientoId;
            // instanciamos un movimiento
            const movimiento = new Movimiento({transaction: t});
            movimiento.MovimientoId = ultimoMovimientoId + 1;
            movimiento.MovimientoCantidad = req.body.MedioPago.MedioPagoId == VARIABLES.ID_MEDIO_PAGO_FACILIDAD ? (req.body.PagoInfo.Total / req.body.MedioPago.MedioPagoCantidadCuotas) : req.body.PagoInfo.Total;
            movimiento.createdBy = req.body.createdBy;
            movimiento.MovimientoDia = new Date().getDate();
            movimiento.MovimientoMes = new Date().getMonth()+1;
            movimiento.MovimientoAño = new Date().getFullYear();
            movimiento.MovimientoConceptoId = 6; //cambio de servicio
            movimiento.MunicipioId = req.body.MunicipioId;
            movimiento.AbonadoId = abonado.UserId;
            movimiento.MedioPagoId = req.body.MedioPago.MedioPagoId;
            //registramos un nuevo pago
            const pago = new Pago({transaction: t});
            pago.PagoId = ultimoPagoId + 1;
            pago.UserId = abonado.UserId;
            pago.PagoAño = new Date().getFullYear();
            pago.PagoMes = new Date().getMonth() + 1;
            pago.PagoTotal = req.body.PagoInfo.Total;
            pago.PagoRecargo = 0;
            pago.PagoSaldo = req.body.MedioPago.MedioPagoId == VARIABLES.ID_MEDIO_PAGO_FACILIDAD ? (req.body.PagoInfo.Total / req.body.MedioPago.MedioPagoCantidadCuotas) : 0;
            pago.PagoConceptoId = 6;
            pago.createdAt = new Date();
            pago.createdBy = req.body.createdBy;
            const detallePago = new DetallePago({transaction: t})
            detallePago.DetallePagoId = ultimoDetallePagoId + 1;
            detallePago.PagoId = ultimoPagoId + 1;
            detallePago.MedioPagoId = req.body.MedioPago.MedioPagoId;
            detallePago.createdAt = new Date();
            detallePago.createdBy = req.body.createdBy;
            detallePago.DetallePagoMonto = req.body.MedioPago.MedioPagoId == VARIABLES.ID_MEDIO_PAGO_FACILIDAD ? (req.body.PagoInfo.Total / req.body.MedioPago.MedioPagoCantidadCuotas) : req.body.PagoInfo.Total;
            detallePago.MovimientoId = movimiento.MovimientoId;
            const ot = new Ot(req.body);
            ot.OtId = ultimaOtRegistradaId + 1;
            ot.AbonadoId = req.body.UserId;
            ot.EstadoId = VARIABLES.ESTADO_ID_OT_REGISTRADA;
            ot.OtFechaPrevistaVisita = req.body.OtFechaPrevistaVisita;
            ot.OtObservacionesResponsableEmision = req.body.OtObservacionesResponsableEmision;
            ot.OtResponsableEjecucion = req.body.Tecnico.UserId;
            ot.NuevoServicioId = req.body.Servicio.ServicioId;
            ot.createdBy = req.body.createdBy; 
            await ot.save({transaction: t});
            const abonadoServicio = new UserServicio(req.body, {transaction: t});
            abonadoServicio.UserServicioId = ultimoUserServicioId + 1;
            abonadoServicio.ServicioId = req.body.Servicio.ServicioId;
            abonadoServicio.OtId = ot.OtId;
            abonadoServicio.CambioServicioObservaciones = 'Esperando finalización de OT. Una vez finalizada, este pasará a ser el nuevo servicio del abonado';
            for (let i=0; i<= req.body.Tecnico.length-1; i++){
                let obj = {
                    TecnicoId: req.body.Tecnico[i].UserId,
                    OtId: ot.OtId,
                    createdBy: req.body.createdBy
                }
                const otTecnico = new OtTecnico(obj);
                await otTecnico.save({transaction: t});
            }

            let otTarea1 = null;
            let otTarea2 = null;
            if(req.body.Servicio.ServicioId === 1 || req.body.Servicio.ServicioId === 2) {
                otTarea1 = new OtTarea({
                    TareaId: req.body.Servicio.ServicioId === 1 ? 1 : 5, //Bajada de Cable o Internet
                    OtId: ot.OtId,
                    createdBy: req.body.createdBy
                });
                await otTarea1.save({transaction: t});
            }
            else {
                otTarea1 = new OtTarea({
                    TareaId: 1, //Bajada de Cable
                    OtId: ot.OtId,
                    createdBy: req.body.createdBy
                });
                otTarea2 = new OtTarea({
                    TareaId: 5, //Bajada de Internet
                    OtId: ot.OtId,
                    createdBy: req.body.createdBy
                });
                await otTarea1.save({transaction: t});
                await otTarea2.save({transaction: t});
            }
            await pago.save({transaction: t});
            await detallePago.save({transaction: t});
            await abonado.save({transaction: t});
            await abonadoServicio.save({transaction: t});
            let factura = null;
            let recibo = null;
            let datosFactura = null;
            let datosRecibo = null;
            const domicilioAbonado = await Domicilio.findOne({
                where: {
                    DomicilioId: abonado.DomicilioId
                }
            })
            const barrioAbonado = await Barrio.findOne({
                where: {
                    BarrioId: domicilioAbonado.BarrioId
                }
            })
            const municipioAbonado = await Municipio.findOne({
                where: {
                    MunicipioId: barrioAbonado.MunicipioId
                }
            })
            const movimientoConceptoNombre = await MovimientoConcepto.findOne({
                where: {
                    MovimientoConceptoId: movimiento.MovimientoConceptoId
                }
            })
            if(req.body.RequiereFactura){
                let ultimaFacturaId = 0;
                //Buscamos la ultima Factura
                const ultimaFactura = await Factura.findOne({
                    order: [['FacturaId', 'DESC']]
                });
                if (ultimaFactura) ultimaFacturaId = ultimaFactura.FacturaId;
                const data  = {
                    'CantReg' 		: 1, // Cantidad de comprobantes a registrar
                    'PtoVta' 		: 3, // Punto de venta
                    'CbteTipo' 		: 6, // Tipo de comprobante (ver tipos disponibles). (6)Factura B
                    'Concepto' 		: 2, // Concepto del Comprobante: (1)Productos, (2)Servicios, (3)Productos y Servicios
                    'DocTipo' 		: 80, // Tipo de documento del comprador (ver tipos disponibles). (80)CUIT
                    'DocNro' 		: 20405245125, // Numero de documento del comprador
                    'CbteFch' 		: parseInt(date.replace(/-/g, '')), // (Opcional) Fecha del comprobante (yyyymmdd) o fecha actual si es nulo
                    'FchServDesde'  : parseInt(date.replace(/-/g, '')), // (Opcional) Fecha de inicio del servicio (yyyymmdd), obligatorio para Concepto 2 y 3
                    'FchServHasta'  : parseInt(date.replace(/-/g, '')), // (Opcional) Fecha de fin del servicio (yyyymmdd), obligatorio para Concepto 2 y 3
                    'FchVtoPago'    : parseInt(date.replace(/-/g, '')), // (Opcional) Fecha de vencimiento del servicio (yyyymmdd), obligatorio para Concepto 2 y 3
                    'ImpTotal' 		: req.body.PagoInfo.DetallePagoMonto, // Importe total del comprobante
                    'ImpTotConc' 	: req.body.PagoInfo.DetallePagoMonto, // Importe neto no gravado
                    'MonId' 		: 'PES', //Tipo de moneda usada en el comprobante (ver tipos disponibles)('PES' para pesos argentinos) 
                    'MonCotiz' 		: 1, // Cotización de la moneda usada (1 para pesos argentinos)  
                }
                const nuevoComprobante = await afip.ElectronicBilling.createNextVoucher(data, true);
                factura = new Factura({transaction: t});
                factura.FacturaId = ultimaFacturaId + 1;
                factura.FacturaNumeroComprobante = nuevoComprobante.voucherNumber;
                factura.FacturaCodigoAutorizacion = nuevoComprobante.CAE;
                factura.FacturaFechaVencimientoCodigoAutorizacion = nuevoComprobante.CAEFchVto;
                factura.FacturaTipoCodigoAutorizacion = "E";
                factura.FacturaImporte = req.body.PagoInfo.Total;
                factura.FacturaVersion = 1;
                factura.FacturaCuitEmisor = afip.CUIT;
                factura.FacturaPuntoVenta = 1;
                factura.FacturaFechaEmision = date;
                factura.FacturaTipoComprobante = 6;
                factura.FacturaMoneda = "PES";
                factura.FacturaCotizacion = 1;
                factura.FacturaTipoDocReceptor = 80;
                factura.FacturaNroDocReceptor = 20405245125;
                factura.FacturaAño = new Date().getFullYear();
                factura.FacturaMes = new Date().getMonth() + 1;
                factura.AbonadoId = abonado.UserId;
                factura.createdAt = new Date();
                factura.createdBy = req.body.createdBy;
                movimiento.FacturaId = factura.FacturaId;
                await factura.save({transaction: t});
                datosFactura = {FacturaId: factura.FacturaId, FacturaNumeroComprobante: factura.FacturaNumeroComprobante,
                    FacturaCodigoAutorizacion: factura.FacturaCodigoAutorizacion, FacturaFechaVencimientoCodigoAutorizacion: factura.FacturaFechaVencimientoCodigoAutorizacion,
                    FacturaTipoCodigoAutorizacion: factura.FacturaTipoCodigoAutorizacion, FacturaImporte: factura.FacturaImporte,
                    FacturaVersion: factura.FacturaVersion, FacturaCuitEmisor: factura.FacturaCuitEmisor, FacturaPuntoVenta: factura.FacturaPuntoVenta,
                    FacturaFechaEmision: factura.FacturaFechaEmision, FacturaTipoComprobante: factura.FacturaTipoComprobante,
                    FacturaMoneda: factura.FacturaMoneda, FacturaCotizacion: factura.FacturaCotizacion, FacturaTipoDocReceptor: factura.FacturaTipoDocReceptor,
                    FacturaNroDocReceptor: factura.FacturaNroDocReceptor, FacturaAño: factura.FacturaAño, FacturaMes: factura.FacturaMes,
                    AbonadoId: factura.AbonadoId, createdAt: factura.createdAt, createdBy: factura.createdBy,
                    ApellidoAbonado: abonado.Apellido, NombreAbonado: abonado.Nombre, Cuit: abonado.Cuit, AbonadoNumero: abonado.AbonadoNumero,
                    DomicilioCalle: domicilioAbonado.DomicilioCalle, DomicilioNumero: domicilioAbonado.DomicilioNumero,
                    BarrioNombre: barrioAbonado.BarrioNombre, MunicipioNombre: municipioAbonado.MunicipioNombre,
                    MovimientoConceptoId: movimiento.MovimientoConceptoId, MovimientoConceptoNombre: movimientoConceptoNombre.MovimientoConceptoNombre, MovimientoCantidad: movimiento.MovimientoCantidad    
                }
            }
            else {
                let ultimoReciboId = 0;
                //Buscamos el ultimo Recibo
                const ultimoRecibo = await Recibo.findOne({
                    order: [['ReciboId', 'DESC']]
                });
                if (ultimoRecibo) ultimoReciboId = ultimoRecibo.ReciboId;
                recibo = new Recibo({transaction: t});
                recibo.ReciboId = ultimoReciboId + 1;
                recibo.ReciboImporte = req.body.MedioPago.MedioPagoId == VARIABLES.ID_MEDIO_PAGO_FACILIDAD ? (req.body.PagoInfo.Total / req.body.MedioPago.MedioPagoCantidadCuotas) : req.body.PagoInfo.Total;
                recibo.createdAt = new Date();
                recibo.createdBy = req.body.PagoInfo.createdBy;
                await recibo.save({transaction: t});
                movimiento.ReciboId = recibo.ReciboId;
                datosRecibo = {ReciboId: recibo.ReciboId, createdAt: recibo.createdAt,
                    ApellidoAbonado: abonado.Apellido, NombreAbonado: abonado.Nombre, Cuit: abonado.Cuit, AbonadoNumero: abonado.AbonadoNumero,
                    DomicilioCalle: domicilioAbonado.DomicilioCalle, DomicilioNumero: domicilioAbonado.DomicilioNumero,
                    BarrioNombre: barrioAbonado.BarrioNombre, MunicipioNombre: municipioAbonado.MunicipioNombre,
                    MovimientoConceptoId: movimiento.MovimientoConceptoId, MovimientoConceptoNombre: movimientoConceptoNombre.MovimientoConceptoNombre, MovimientoCantidad: movimiento.MovimientoCantidad    
                }
            }
            await movimiento.save({transaction: t});
            return res.status(200).json({msg: 'El servicio del abonado ha sido cambiado correctamente', factura: datosFactura, recibo: datosRecibo})
        }
        })
    } catch (error) {
        res.status(400).json({msg: 'Hubo un error al cambiar el servicio del abonado'});
        console.log(error);
    }
}
exports.AbonadoCambioTitularidad = async(req, res) => {
    console.log(req.body.BarrioId);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
        await db.transaction(async(t)=>{
            let abonadoNuevoDomicilio = null;
            let nuevoDomicilio = null;
            const añoFechaFinalizacion = parseInt(req.body.FechaContrato.split('-')[0]);
            //buscamos el abonado viejo
            const abonado = await User.findByPk( req.body.UserIdViejo, {transaction: t} );
            //cambiamos su estado a INACTIVO, le desasignamos la ONU si es que tiene y la fecha de bajada
            abonado.OnuId = null;
            abonado.FechaBajada = null;
            abonado.EstadoId = VARIABLES.ESTADO_ID_ABONADO_INACTIVO;
            //creamos nuevo abonado con la información de la vista
            const abonadoNuevo = new User(req.body, {transaction: t});
            abonadoNuevo.UserId = uuidv4().toUpperCase();
            abonadoNuevo.EstadoId = VARIABLES.ESTADO_ID_ABONADO_ACTIVO;
            abonadoNuevo.EsUsuarioDeSistema = 0;
            abonadoNuevo.FechaVencimientoServicio = req.body.FechaContrato.replace(añoFechaFinalizacion, añoFechaFinalizacion + 2);
            const abonadoNuevoRole = new UserRole();
            abonadoNuevoRole.UserId = abonadoNuevo.UserId;
            abonadoNuevoRole.RoleId = VARIABLES.ID_ROL_ABONADO;
            const abonadoEstado = new UserEstado(req.body, {transaction: t});
            let ultimoUserEstado = await UserEstado.findOne({
                order: [["UserEstadoId", "DESC"]]
            });
            abonadoEstado.UserEstadoId = ultimoUserEstado.UserEstadoId + 1;
            abonadoEstado.UserId = abonado.UserId;
            abonadoEstado.EstadoId = VARIABLES.ESTADO_ID_ABONADO_INACTIVO;
            abonadoEstado.CambioEstadoFecha = new Date();
            abonadoEstado.CambioEstadoObservaciones = `Dado de Baja por Cambio de Titularidad con abonado: ${abonado.Apellido}, ${abonado.Nombre}`;
            //le asignamos el nuevo usuario a los pagos del abonado viejo
            const abonadoNuevoServicio = new UserServicio(req.body, {transaction: t});
            let ultimoUserServicio = await UserServicio.findOne({
                order: [["UserServicioId", "DESC"]]
            })
            abonadoNuevoServicio.UserId = abonadoNuevo.UserId;
            abonadoNuevoServicio.UserServicioId = ultimoUserServicio.UserServicioId + 1;
            abonadoNuevoServicio.CambioServicioFecha = new Date();
            abonadoNuevoServicio.CambioServicioObservaciones = `Primer servicio por Cambio de Titularidad con abonado: ${abonadoNuevo.Apellido}, ${abonadoNuevo.Nombre}`;
            const abonadoNuevoEstado = new UserEstado(req.body, {transaction: t});
            abonadoNuevoEstado.UserEstadoId = ultimoUserEstado.UserEstadoId + 2;
            abonadoNuevoEstado.UserId = abonadoNuevo.UserId;
            abonadoNuevoEstado.EstadoId = VARIABLES.ESTADO_ID_ABONADO_ACTIVO;
            abonadoNuevoEstado.CambioEstadoFecha = new Date();
            abonadoNuevoEstado.CambioEstadoObservaciones =  `Dado de Alta por Cambio de Titularidad con abonado: ${abonadoNuevo.Apellido}, ${abonadoNuevo.Nombre}`;
            if(req.body.DomicilioId === 0) { //chequeamos si es mismo domicilio
                let ultimoUserDomicilio = await UserDomicilio.findOne({
                    order: [["UserDomicilioId", "DESC"]]
                })
                let ultimoDomicilio = await Domicilio.findOne({
                    order: [["DomicilioId", "DESC"]]
                })
                nuevoDomicilio = new Domicilio(req.body, {transaction: t});
                nuevoDomicilio.DomicilioId = ultimoDomicilio.DomicilioId + 1;
                abonadoNuevo.DomicilioId = ultimoDomicilio.DomicilioId + 1;
                abonadoNuevoDomicilio = new UserDomicilio(req.body, {transaction: t});
                abonadoNuevoDomicilio.UserDomicilioId = ultimoUserDomicilio.UserDomicilioId + 1;
                abonadoNuevoDomicilio.UserId = abonadoNuevo.UserId;
                abonadoNuevoDomicilio.DomicilioId = ultimoDomicilio.DomicilioId + 1;
                abonadoNuevoDomicilio.CambioDomicilioFecha = new Date();
                abonadoNuevoDomicilio.CambioDomicilioObservaciones = 'Primer Domicilio por cambio de Titularidad';
            };
            await abonado.save({transaction: t});
            if(nuevoDomicilio !== null) await nuevoDomicilio.save({transaction: t});
            await abonadoEstado.save({transaction: t});
            await abonadoNuevo.save({transaction: t});
            await abonadoNuevoRole.save({transaction: t});
            await abonadoNuevoEstado.save({transaction: t});
            await abonadoNuevoServicio.save({transaction: t})
            if(abonadoNuevoDomicilio !== null) await abonadoNuevoDomicilio.save({transaction: t});
            //buscamos su historial de pagos y lo actualizamos
            await Pago.update({UserId: abonadoNuevo.UserId}, {where: {UserId: abonado.UserId}, transaction: t})
            return res.status(200).json({msg: 'La titularidad del abonado ha sido cambiada correctamente'})
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({msg: 'Hubo un error al cambiar la titularidad del abonado'});
    }
}