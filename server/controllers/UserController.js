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
            // creamos un nuevo usuario pasandole lo que traemos de la vista
            const user = new User(req.body);
            const salt = bcrypt.genSaltSync();
            user.Contraseña = bcrypt.hashSync(req.body.Contraseña, salt);
            user.UserId = uuidv4().toUpperCase();
            user.EstadoId = process.env.ESTADO_ID_ABONADO_ACTIVO;
            user.EsUsuarioDeSistema = 1; // es el mismo estado
            //hay que armar un array con todos los objetos a crear
            const userEstado = new UserEstado();
            userEstado.EstadoId = process.env.ESTADO_ID_ABONADO_ACTIVO;
            userEstado.UserId = user.UserId;
            userEstado.CambioEstadoFecha = new Date().toString();
            userEstado.CambioEstadoObservaciones = 'Primer Inscripción';
            await user.save({transaction: t});
            await userEstado.save({transaction: t});
            for (let i=0; i<= req.body.RolesSeleccionados.length-1; i++){
                let obj = {
                    UserId: user.UserId,
                    RoleId: req.body.RolesSeleccionados[i]
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
            if(req.body.Contraseña !== req.body.RContraseña) return res.status(400).json({msg: 'Las contraseñas no coinciden'});
            let userRoleVec = [];
            //buscamos el usuario por su Id
            const usuario = await User.findByPk( req.body.UserId, {transaction: t} );
            if(req.body.RolesSeleccionados.length !== 0){
                //eliminamos los roles que tiene actualmente el usuario
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
            await usuario.update(req.body, {transaction: t});
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
            //buscamos el usuario por su Id
            const usuario = await User.findByPk( req.body.UserId, {transaction: t} );
            await usuario.save({transaction: t});
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
            'u.estadoId': req.params.estadoId
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
            'u.estadoId': req.params.estadoId
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

exports.AbonadoListarDomicilios = async(req, res) => {
    try {
        const domicilios = await knex.select('*').from('userdomicilio as ud')
        .innerJoin('_user as u', 'u.UserId', '=', 'ud.UserId')
        .innerJoin('domicilio as d', 'd.DomicilioId', '=', 'ud.DomicilioId')
        .innerJoin('barrio as b', 'b.BarrioId', '=', 'd.BarrioId')
        .innerJoin('municipio as m', 'm.MunicipioId', '=', 'b.MunicipioId')
        .where('ud.UserId', '=', req.params.id)
        .orderBy('ud.CambioDomicilioFecha', 'desc');
        res.json(domicilios);
    } catch (error) {
        res.status(500).json({ msg: 'Hubo un error al encontrar los domicilios de los abonados'});
    }
}

exports.AbonadoListarServicios = async(req, res) => {
    try {
        const servicios = await knex.select('us.CambioServicioFecha', 'us.CambioServicioObservaciones', 's.ServicioNombre', 'o.OnuMac').from('userservicio as us')
        .innerJoin('servicio as s', 's.ServicioId', '=', 'us.ServicioId')
        .leftJoin('onu as o', 'o.OnuId', '=','us.OnuId')
        .where('us.UserId', '=', req.params.id)
        .orderBy('us.CambioServicioFecha', 'desc');
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
        //traemos el id del ultimo domicilio registrado y de la ultima onu registrada
            let ultimoDomicilioId = 0;
            const ultimoDomicilio = await Domicilio.findOne({
                order: [['DomicilioId', 'DESC']]
            });
            if (ultimoDomicilio) ultimoDomicilioId = ultimoDomicilio.DomicilioId;
            // creamos un nuevo abonado pasándole como info todo lo que traemos de la vista
            const abonado = new User(req.body);
            abonado.UserId = uuidv4().toUpperCase();
            abonado.DomicilioId = ultimoDomicilioId + 1;
            abonado.EstadoId = process.env.ESTADO_ID_ABONADO_INSCRIPTO;
            abonado.EsUsuarioDeSistema = 0;
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
            //traemos la ONU por id y actualizamos su estado para que pase a ASIGNADA
            if(req.body.OnuId != 0) {
                const onu = await Onu.findByPk(req.body.OnuId, {transaction: t});
                onu.EstadoId = 4;
                await onu.save({transaction: t});
            }
            await domicilio.save({transaction: t});
            await abonado.save({transaction: t});
            await abonadoRole.save({transaction: t});
            await abonadoDomicilio.save({transaction: t});
            await abonadoServicio.save({transaction: t});
            await abonadoEstado.save({transaction: t});
            return res.status(200).json({msg: 'El Abonado ha sido registrado correctamente'})
        })
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
            await abonado.update(req.body, {transaction: t});
            return res.status(200).json({msg: 'El Abonado ha sido modificado correctamente'})
        })
        }   
    catch (error) {
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
            //traemos el id del ultimo domicilio registrado
            let ultimoDomicilioId = 0;
            const ultimoDomicilio = await Domicilio.findOne({
                order: [['DomicilioId', 'DESC']],
            });
            if (ultimoDomicilio) ultimoDomicilioId = ultimoDomicilio.DomicilioId;
            const domicilio = new Domicilio(req.body, {transaction: t});
            domicilio.DomicilioId = ultimoDomicilioId + 1;
            //buscamos el usuario para actualizarle el domicilio y el estado
            const abonado = await User.findByPk( req.body.UserId, {transaction: t} );
            abonado.DomicilioId = ultimoDomicilioId + 1;
            abonado.EstadoId = 1;
            abonado.FechaBajada = req.body.FechaBajada;
            //await abonado.update(req.body.DomicilioId);
            const abonadoDomicilio = new UserDomicilio(req.body, {transaction: t});
            abonadoDomicilio.DomicilioId = ultimoDomicilioId + 1;
            const abonadoEstado = new UserEstado(req.body, {transaction: t});
            abonadoEstado.EstadoId = 1;
            abonadoEstado.CambioEstadoFecha = new Date().toString();
            abonadoEstado.CambioEstadoObservaciones = 'Cambio de Domicilio';
            await domicilio.save({transaction: t}),
            await abonado.save({transaction: t});
            await abonadoDomicilio.save({transaction: t});
            await abonadoEstado.save({transaction: t});
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
            //buscamos el usuario para actualizarle el domicilio
            const abonado = await User.findByPk( req.body.UserId, {transaction: t} );
            if (abonado.ServicioId === req.body.ServicioId)
            return res.status(400).json({msg: 'Seleccione un servicio diferente al que ya tiene el abonado actualmente'});
            else {
                const abonadoServicio = new UserServicio(req.body, {transaction: t});
                abonadoServicio.ServicioId = req.body.ServicioId;
                abonado.EstadoId = 1;
                abonado.ServicioId = req.body.ServicioId;
                abonado.FechaBajada = req.body.FechaBajada;
                const abonadoEstado = new UserEstado(req.body, {transaction: t});
                abonadoEstado.EstadoId = 1;
                abonadoEstado.CambioEstadoFecha = new Date().toString();
                abonadoEstado.CambioEstadoObservaciones = 'Cambio de Servicio';
                await abonado.save({transaction: t});
                await abonadoServicio.save({transaction: t});
                await abonadoEstado.save({transaction: t});
                //traemos la ONU por id y actualizamos su estado para que pase a ASIGNADA
                if(req.body.OnuId != 0) {
                    const onu = await Onu.findByPk(req.body.OnuId, {transaction: t});
                    onu.EstadoId = 4;
                }
                return res.status(200).json({msg: 'El servicio del abonado ha sido cambiado correctamente'})
            }
        })
    } catch (error) {
        res.status(400).json({msg: 'Hubo un error al cambiar el servicio del abonado'});
    }
}