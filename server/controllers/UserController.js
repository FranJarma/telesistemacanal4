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
const Onu = require('../models/Onu');
const Movimiento = require('../models/Movimiento');
const Tarea = require('../models/Tarea');
const Ot = require('../models/Ot');
const OtTecnico = require('../models/OtTecnico');
const OtTarea = require('../models/OtTarea');

require('dotenv').config({path: 'variables.env'});

//AUTH Y USERS
exports.UserCreate = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
        await db.transaction(async(t)=>{
            if(req.body.Contraseña !== req.body.RContraseña) return res.status(400).json({msg: 'Las contraseñas no coinciden'});
            let userRoleVec = [];
            // creamos un nuevo user pasandole lo que traemos de la vista
            const user = new User(req.body);
            const salt = bcrypt.genSaltSync();
            user.Contraseña = bcrypt.hashSync(req.body.Contraseña, salt);
            user.UserId = uuidv4().toUpperCase();
            user.EstadoId = process.env.ESTADO_ID_ABONADO_ACTIVO;  // es el mismo estado
            user.EsUsuarioDeSistema = 1;
            //hay que armar un array con todos los objetos a crear
            const userEstado = new UserEstado();
            userEstado.EstadoId = process.env.ESTADO_ID_ABONADO_ACTIVO;
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
            user.DeletedBy = sessionStorage.getItem('identity');
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
        .where({'ur.RoleId': '3EF5B486-2604-44E6-BA2C-D9F78BF7A612'});
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
        abonados = await knex.select('*').select('u.ServicioId').from('_user as u')
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
            'r.RoleId': process.env.ID_ROL_ABONADO,
            'm.MunicipioId': req.params.municipioId,
            'u.EstadoId': req.params.estadoId
        })
        : req.params.municipioId == 0 && req.params.estadoId != 0 ?
        abonados = await knex.select('*').select('u.ServicioId').from('_user as u')
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
            'r.RoleId': process.env.ID_ROL_ABONADO,
            'u.EstadoId': req.params.estadoId
        })
        : req.params.municipioId != 0 && req.params.estadoId == 0 ?
        abonados = await knex.select('*').select('u.ServicioId').from('_user as u')
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
            'r.RoleId': process.env.ID_ROL_ABONADO,
            'm.MunicipioId': req.params.municipioId,
        })
        : abonados = await knex.select('*').select('u.ServicioId').from('_user as u')
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
            'r.RoleId': process.env.ID_ROL_ABONADO
        })
        res.json(abonados);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error al encontrar los abonados'});
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
        const domicilios = await knex.select('*').from('userdomicilio as ud')
        .innerJoin('_user as u', 'u.UserId', '=', 'ud.UserId')
        .innerJoin('domicilio as d', 'd.DomicilioId', '=', 'ud.DomicilioId')
        .innerJoin('barrio as b', 'b.BarrioId', '=', 'd.BarrioId')
        .innerJoin('municipio as m', 'm.MunicipioId', '=', 'b.MunicipioId')
        .where('ud.UserId', '=', req.params.id)
        .orderBy('ud.createdAt', 'desc');
        res.json(domicilios);
    } catch (error) {
        res.status(500).json({ msg: 'Hubo un error al encontrar los domicilios de los abonados'});
    }
}

exports.AbonadoListarServicios = async(req, res) => {
    try {
        const servicios = await knex.select('us.createdAt', 'us.CambioServicioObservaciones', 's.ServicioNombre', 'o.OnuMac').from('userservicio as us')
        .innerJoin('servicio as s', 's.ServicioId', '=', 'us.ServicioId')
        .leftJoin('onu as o', 'o.OnuId', '=','us.OnuId')
        .where('us.UserId', '=', req.params.id)
        .orderBy('us.createdAt', 'desc');
        res.json(servicios);
    } catch (error) {
        res.status(500).json({ msg: 'Hubo un error al encontrar los servicios de los abonados'});
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
            'm.MunicipioId': req.body.Municipio.MunicipioId
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
            const UserId = uuidv4().toUpperCase()
            // creamos un nuevo abonado pasándole como info todo lo que traemos de la vista
            const abonado = new User(req.body, {transaction: t});
            abonado.FechaBajada = req.body.OtFechaPrevistaVisita;
            abonado.UserId = UserId;
            abonado.DomicilioId = ultimoDomicilioId + 1;
            abonado.ServicioId = req.body.Servicio.ServicioId;
            abonado.EstadoId = process.env.ESTADO_ID_ABONADO_INSCRIPTO;
            abonado.EsUsuarioDeSistema = 0;
            const domicilio = new Domicilio(req.body, {transaction: t});
            domicilio.DomicilioId = ultimoDomicilioId + 1;
            domicilio.BarrioId = req.body.Barrio.BarrioId;
            const abonadoRole = new UserRole({transaction: t});
            abonadoRole.UserId = abonado.UserId;
            abonadoRole.RoleId = process.env.ID_ROL_ABONADO;
            const abonadoEstado = new UserEstado({transaction: t});
            abonadoEstado.EstadoId = process.env.ESTADO_ID_ABONADO_INSCRIPTO;
            abonadoEstado.UserId = abonado.UserId;
            abonadoEstado.CambioEstadoFecha = new Date();
            abonadoEstado.CambioEstadoObservaciones = 'Dado de alta';
            //instanciamos un nuevo movimiento
            const movimiento = new Movimiento({transaction: t});
            movimiento.MovimientoId = ultimoMovimientoId + 1;
            movimiento.MovimientoCantidad = req.body.PagoInfo.Inscripcion;
            movimiento.createdBy = req.body.createdBy;
            movimiento.MovimientoDia = new Date().getDate();
            movimiento.MovimientoMes = new Date().getMonth()+1;
            movimiento.MovimientoAño = new Date().getFullYear();
            movimiento.MovimientoConceptoId = 2; //inscripción
            movimiento.MunicipioId = req.body.MunicipioId;
            //registramos un nuevo pago
            const pago = new Pago({transaction: t});
            pago.PagoId = ultimoPagoId + 1;
            pago.UserId = UserId;
            pago.PagoAño = new Date().getFullYear();
            pago.PagoMes = new Date().getMonth() + 1;
            pago.PagoTotal = req.body.PagoInfo.Total;
            pago.PagoRecargo = 0;
            pago.PagoSaldo = req.body.PagoInfo.Saldo;
            pago.createdAt = new Date();
            pago.createdBy = req.body.createdBy;
            const detallePago = new DetallePago({transaction: t})
            detallePago.DetallePagoId = ultimoDetallePagoId + 1;
            detallePago.PagoId = ultimoPagoId + 1;
            detallePago.MedioPagoId = req.body.MedioPago.MedioPagoId;
            detallePago.createdAt = new Date();
            detallePago.createdBy = req.body.createdBy;
            detallePago.DetallePagoMonto = req.body.PagoInfo.Inscripcion;
            detallePago.DetallePagoMotivo = 'Inscripción';
            await domicilio.save({transaction: t});
            await abonado.save({transaction: t});
            await abonadoRole.save({transaction: t});
            await abonadoEstado.save({transaction: t});
            await pago.save({transaction: t});
            await detallePago.save({transaction: t});
            await movimiento.save({transaction: t});
            const ot = new Ot(req.body);
            ot.OtId = ultimaOtRegistradaId + 1;
            ot.AbonadoId = UserId;
            ot.EstadoId = process.env.ESTADO_ID_OT_REGISTRADA;
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
            return res.status(200).json({msg: 'El Abonado ha sido registrado correctamente'});
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
            await abonado.update(req.body, {transaction: t});
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
        res.status(400).json({msg: 'Hubo un error al dar de baja el abonado'});
    }
}

exports.AbonadoCambioDomicilio = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
        await db.transaction(async(t)=>{
            // traemos el id del ultimo domicilio registrado
            let ultimoDomicilioId = 0;
            const ultimoDomicilio = await Domicilio.findOne({
                order: [['DomicilioId', 'DESC']],
            });
            if (ultimoDomicilio) ultimoDomicilioId = ultimoDomicilio.DomicilioId;
            // buscamos el ultimo Movimiento
            let ultimoMovimientoId = 0;
            const ultimoMovimiento = await Movimiento.findOne({
                order: [['MovimientoId', 'DESC']]
            }); 
            if (ultimoMovimiento) ultimoMovimientoId = ultimoMovimiento.MovimientoId;
            const domicilio = new Domicilio(req.body, {transaction: t});
            domicilio.DomicilioId = ultimoDomicilioId + 1;
            domicilio.BarrioId = req.body.Barrio.BarrioId;
            //buscamos el user para actualizarle el domicilio y el estado
            const abonado = await User.findByPk( req.body.UserId, {transaction: t} );
            abonado.DomicilioId = ultimoDomicilioId + 1;
            // abonado.EstadoId = 1;
            // abonado.FechaBajada = req.body.FechaBajada;
            //await abonado.update(req.body.DomicilioId);
            let ultimoUserDomicilio = await UserDomicilio.findOne({
                order: [["UserDomicilioId", "DESC"]]
            })
            const abonadoDomicilio = new UserDomicilio(req.body, {transaction: t});
            abonadoDomicilio.UserDomicilioId = ultimoUserDomicilio.UserDomicilioId + 1;
            abonadoDomicilio.DomicilioId = ultimoDomicilioId + 1;
            // traemos el precio de la tarea de cambio de domicilio
            const tarea = await Tarea.findOne({
                where: {
                    TareaId: req.body.ServicioId === 1 ? 14 : 15
                }
            })
            // instanciamos un movimiento
            const movimiento = new Movimiento({transaction: t});
            movimiento.MovimientoId = ultimoMovimientoId + 1;
            movimiento.MovimientoCantidad = tarea.TareaPrecioUnitario;
            movimiento.createdBy = req.body.createdBy;
            movimiento.MovimientoDia = new Date().getDate();
            movimiento.MovimientoMes = new Date().getMonth()+1;
            movimiento.MovimientoAño = new Date().getFullYear();
            movimiento.MovimientoConceptoId = req.body.ServicioId === 1 ? 5 : 6; //cambio de domicilio
            movimiento.MunicipioId = req.body.MunicipioId;
            await domicilio.save({transaction: t}),
            await abonado.save({transaction: t});
            await abonadoDomicilio.save({transaction: t});
            await movimiento.save({transaction: t});
            return res.status(200).json({msg: 'El domicilio del abonado ha sido cambiado correctamente'})
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
            //buscamos el user para actualizarle el servicio
            console.log(req.body);
            const abonado = await User.findByPk( req.body.UserId, {transaction: t} );
            if (abonado.ServicioId === req.body.ServicioId){
                return res.status(400).json({msg: 'Seleccione un servicio diferente al que ya tiene el abonado actualmente'});
            }
            else {
                let ultimoUserServicio = await UserServicio.findOne({
                    order: [["UserServicioId", "DESC"]]
                })
                const abonadoServicio = new UserServicio(req.body, {transaction: t});
                const onu = await Onu.findByPk(req.body.OnuId, {transaction: t});
                abonadoServicio.UserServicioId = ultimoUserServicio.UserServicioId + 1;
                abonadoServicio.ServicioId = req.body.ServicioId;
                abonado.ServicioId = req.body.ServicioId;
                abonado.FechaBajada = req.body.FechaBajada;
                await abonado.save({transaction: t});
                await abonadoServicio.save({transaction: t});
                //si el servicio es INTERNET O COMBO, cambiamos el estado de la ONU a asignada
                if(req.body.ServicioId !== 1) {
                    abonado.OnuId = req.body.OnuId;
                    onu.EstadoId = 4;
                }
                else {
                    abonado.OnuId = null;
                    onu.EstadoId = 5; //desasignamos onu
                }
                return res.status(200).json({msg: 'El servicio del abonado ha sido cambiado correctamente'})
            }
        })
    } catch (error) {
        res.status(400).json({msg: 'Hubo un error al cambiar el servicio del abonado'});
        console.log(error);
    }
}
exports.AbonadoCambioTitularidad = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
        await db.transaction(async(t)=>{
            let abonadoNuevoDomicilio = null;
            let nuevoDomicilio = null;
            //buscamos el abonado viejo
            const abonado = await User.findByPk( req.body.UserIdViejo, {transaction: t} );
            //cambiamos su estado a INACTIVO, le desasignamos la ONU si es que tiene y la fecha de bajada
            abonado.OnuId = null;
            abonado.FechaBajada = null;
            abonado.EstadoId = process.env.ESTADO_ID_ABONADO_INACTIVO;
            //creamos nuevo abonado con la información de la vista
            const abonadoNuevo = new User(req.body, {transaction: t});
            abonadoNuevo.UserId = uuidv4().toUpperCase();
            abonadoNuevo.EstadoId = process.env.ESTADO_ID_ABONADO_ACTIVO;
            abonadoNuevo.EsUsuarioDeSistema = 0;
            const abonadoNuevoRole = new UserRole();
            abonadoNuevoRole.UserId = abonadoNuevo.UserId;
            abonadoNuevoRole.RoleId = process.env.ID_ROL_ABONADO;
            const abonadoEstado = new UserEstado(req.body, {transaction: t});
            let ultimoUserEstado = await UserEstado.findOne({
                order: [["UserEstadoId", "DESC"]]
            });
            abonadoEstado.UserEstadoId = ultimoUserEstado.UserEstadoId + 1;
            abonadoEstado.UserId = abonado.UserId;
            abonadoEstado.EstadoId = process.env.ESTADO_ID_ABONADO_INACTIVO;
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
            abonadoNuevoEstado.EstadoId = process.env.ESTADO_ID_ABONADO_ACTIVO;
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