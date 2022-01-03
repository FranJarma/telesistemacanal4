const db = require('../config/connection');
const options =require('./../config/knex');
const knex = require('knex')(options);
const { validationResult } = require('express-validator');
const Ot = require('../models/Ot');
const Domicilio = require('./../models/Domicilio');
const UserDomicilio = require('./../models/UserDomicilio');
const UserServicio = require('./../models/UserServicio');
const User = require('./../models/User');
const OtTecnico = require('../models/OtTecnico');
const OtTarea = require('../models/OtTarea');

require('dotenv').config({path: 'variables.env'});

exports.OtGet = async(req, res) => {
    try {
        const ot = await knex
        .select('ot.OtId', 'ot.OtFechaPrevistaVisita', 'ot.OtPrimeraVisita', 'ot.OtSegundaVisita', 'ot.OtTerceraVisita', 'ot.OtCuartaVisita',
        'ot.OtObservacionesResponsableEmision', 'ot.OtFechaInicio', 'ot.OtFechaFinalizacion', 'ot.OtRetiraCable', 'ot.OtRetiraOnu',
        'ot.createdAt', 'ot.OtObservacionesResponsableEjecucion',
        'u.Nombre as NombreAbonado', 'u.Apellido as ApellidoAbonado',
        'u1.Nombre as NombreResponsableCreacion', 'u1.Apellido as ApellidoResponsableCreacion',
        'd.DomicilioCalle', 'd.DomicilioNumero', 'b.BarrioId', 'b.BarrioNombre', 'm.MunicipioId', 'm.MunicipioNombre'
        )
        .sum('t.TareaPrecioUnitario as Monto')
        .from('ot as ot')
        .innerJoin('_user as u', 'u.UserId', '=', 'ot.AbonadoId')
        .innerJoin('_user as u1', 'u1.UserId', '=', 'ot.createdBy')
        .innerJoin('domicilio as d', 'u.DomicilioId', '=', 'd.DomicilioId')
        .innerJoin('barrio as b', 'b.BarrioId', '=', 'd.BarrioId')
        .innerJoin('municipio as m', 'b.MunicipioId', '=', 'm.MunicipioId')
        .innerJoin('ottarea as ott', 'ott.OtId', '=' ,'ot.OtId')
        .innerJoin('tarea as t', 'ott.TareaId', '=' ,'t.TareaId')
        .where(
            {'ot.deletedAt': null,
            'ot.EstadoId': req.params.estadoId
            })
        .groupBy('ot.OtId')
        .orderBy('ot.createdAt', 'desc');
        res.json(ot);
    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: 'Hubo un error al encontrar las órdenes de trabajo'});
    }
}

exports.OtCreate = async(req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        await db.transaction(async(t) => {
            let ultimaOtRegistradaId = 0;
            //Buscamos la ultima OT registrada
            let ultimaOtRegistrada = await Ot.findOne({
                order: [['OtId', 'DESC']]
            });
            if(ultimaOtRegistrada) ultimaOtRegistradaId = ultimaOtRegistrada.OtId;
            //verificar que no existe una OT registrada para ese día, ese abonado y esas tareas seleccionadas
            const ot = new Ot(req.body);
            ot.OtId = ultimaOtRegistradaId + 1;
            ot.AbonadoId = req.body.abonado.UserId;
            ot.EstadoId = process.env.ESTADO_ID_OT_REGISTRADA;
            ot.OtObservacionesResponsableEmision = req.body.OtObservacionesResponsableEmision;
            ot.createdBy = req.body.createdBy; //registrada
            await ot.save({transaction: t});
            console.log(req.body);
            for (let i=0; i<= req.body.tecnicosOt.length-1; i++){
                let obj = {
                    TecnicoId: req.body.tecnicosOt[i].UserId,
                    OtId: ot.OtId,
                    createdBy: req.body.createdBy
                }
                const otTecnico = new OtTecnico(obj);
                await otTecnico.save({transaction: t});
            }
        
            for (let i=0; i<= req.body.tareasOt.length-1; i++){
                let obj = {
                    TareaId: req.body.tareasOt[i].TareaId,
                    OtId: ot.OtId,
                    createdBy: req.body.createdBy
                }
                const otTarea = new OtTarea(obj);
                await otTarea.save({transaction: t});
            }
            return res.status(200).send({ msg: 'La Orden de Trabajo ha sido registrada correctamente'});
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: 'Hubo un error al registrar la orden de trabajo'});
    }
}

exports.OtUpdate = async (req, res) => {
    try {
        await db.transaction(async (t)=> {
            const ot = await Ot.findByPk(req.body.OtId, {transaction: t});
            await ot.update({
                OtObservacionesResponsableEmision: req.body.OtObservacionesResponsableEmision,
                OtFechaPrevistaVisita: req.body.OtFechaPrevistaVisita,
                OtRetiraCable: req.body.OtRetiraCable,
                OtRetiraOnu: req.body.OtRetiraOnu,
                updatedAt: new Date(),
                updatedBy: req.body.updatedBy
            }, {transaction: t});

            if(req.body.tareasOt && req.body.tareasOt.length !== 0){
                //eliminamos las tareas que tiene la OT
                await OtTarea.destroy({where: {
                    OtId: req.body.OtId
                }}, {transaction: t});
                //creamos las nuevas tareas
                for (let i=0; i<= req.body.tareasOt.length-1; i++){
                    let obj = {
                        OtId: req.body.OtId,
                        TareaId: req.body.tareasOt[i].TareaId,
                        createdBy: req.body.createdBy
                    }
                    const nuevaTareaOt = new OtTarea(obj);
                    await nuevaTareaOt.save({transaction: t});
                }
            }

            if(req.body.tecnicosOt && req.body.tecnicosOt.length !== 0){
                //eliminamos los técnicos que tiene la OT
                await OtTecnico.destroy({where: {
                    OtId: req.body.OtId
                }}, {transaction: t});
                //creamos las nuevas tareas
                for (let i=0; i<= req.body.tecnicosOt.length-1; i++){
                    let obj = {
                        OtId: req.body.OtId,
                        TecnicoId: req.body.tecnicosOt[i].UserId,
                        updatedAt: new Date(),
                        updatedBy: req.body.updatedBy
                    }
                    const nuevoTecnicoOt = new OtTecnico(obj);
                    await nuevoTecnicoOt.save({transaction: t});
                }
            }

            return res.status(200).json({msg: 'La orden de trabajo ha sido modificada correctamente'})
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: 'Hubo un error al modificar la orden de trabajo'});
    }
}

exports.OtRegistrarVisita = async (req, res) => {
    try {
        await db.transaction(async (t)=> {
            const { OtId, FechaVisita } = req.body;
            const ot = await Ot.findByPk(OtId, {transaction: t});
            if(ot.OtPrimeraVisita === null){
                ot.OtPrimeraVisita = FechaVisita;
                await ot.save({transaction: t});
            }
            else if(ot.OtPrimeraVisita !== null && ot.OtSegundaVisita === null){
                ot.OtSegundaVisita = FechaVisita;
                await ot.save({transaction: t});
            }
            else if(ot.OtPrimeraVisita !== null && ot.OtSegundaVisita !== null && ot.OtTerceraVisita === null){
                ot.OtTerceraVisita = FechaVisita;
                await ot.save({transaction: t});
            }
            else if(ot.OtPrimeraVisita !== null && ot.OtSegundaVisita !== null && ot.OtTerceraVisita !== null && ot.OtCuartaVisita === null){
                ot.OtCuartaVisita = FechaVisita;
                await ot.save({transaction: t});
            }
            return res.status(200).json({msg: 'La fecha de visita de la OT ha sido registrada correctamente'})
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: 'Hubo un error al registrar la visita de la OT'});
    }
}

exports.OtFinalizar = async (req, res) => {
    try {
        const { OtId, OtFechaInicio, OtFechaFinalizacion, OtObservacionesResponsableEjecucion, updatedBy } = req.body;
        await db.transaction(async (t)=> {
            if( OtFechaInicio > OtFechaFinalizacion ) return res.status(400).send({msg: 'La hora de Inicio no puede ser mayor a la de finalización'});
            const ot = await Ot.findByPk(OtId);
            ot.OtFechaInicio = OtFechaInicio;
            ot.OtFechaFinalizacion = OtFechaFinalizacion;
            ot.OtObservacionesResponsableEjecucion = OtObservacionesResponsableEjecucion;
            ot.EstadoId = process.env.ESTADO_ID_OT_FINALIZADA;
            ot.updatedAt = new Date();
            ot.updatedBy = updatedBy;
            await ot.save({transaction: t});
            const tareasOt = await OtTarea.findAll({
                where: {
                    OtId: OtId
                }
            });
            //si la tarea seleccionada es Cambio Domicilio (de cualquier tipo), instanciamos un objeto de la clase CambioDomicilio
            for (let i=0; i<= tareasOt.length-1; i++) {
                if(tareasOt[i].TareaId === 14 || tareasOt[i].TareaId === 15) {
                    //traemos el id del ultimo domicilio registrado
                    let ultimoDomicilioId = 0;
                    const ultimoDomicilio = await Domicilio.findOne({
                        order: [['DomicilioId', 'DESC']],
                    });
                    if (ultimoDomicilio) ultimoDomicilioId = ultimoDomicilio.DomicilioId;
                    const domicilio = new Domicilio(req.body, {transaction: t});
                    domicilio.DomicilioId = ultimoDomicilioId + 1;
                    domicilio.BarrioId = req.body.barrio.BarrioId;
                    domicilio.DomicilioCalle = req.body.DomicilioCalle;
                    domicilio.DomicilioNumero = req.body.DomicilioNumero;
                    domicilio.DomicilioPiso = req.body.DomicilioPiso;
                    domicilio.createdAt = req.body.createdAt;
                    domicilio.createdBy = req.body.createdBy;
                    //buscamos el user para actualizarle el estado, el domicilio se lo actualiza cuando se confirme la instalación
                    const abonado = await User.findByPk( req.body.abonado.UserId, {transaction: t} );
                    let ultimoUserDomicilio = await UserDomicilio.findOne({
                        order: [["UserDomicilioId", "DESC"]]
                    })
                    const abonadoDomicilio = new UserDomicilio(req.body, {transaction: t});
                    abonadoDomicilio.UserDomicilioId = ultimoUserDomicilio.UserDomicilioId + 1;
                    abonadoDomicilio.DomicilioId = ultimoDomicilioId + 1;
                    abonadoDomicilio.UserId = abonado.UserId;
                    abonadoDomicilio.CambioDomicilioObservaciones = `Cambio de domicilio realizado en fecha: ${createdAt.split('T')[0]} por orden de trabajo N°: ${ot.OtId}`;
                    abonadoDomicilio.createdAt = req.body.createdAt;
                    abonadoDomicilio.createdBy = req.body.createdBy;
                    await domicilio.save({transaction: t}),
                    await abonado.save({transaction: t});
                    await abonadoDomicilio.save({transaction: t});
                }
                //si la tarea seleccionada es algo relacionado a cambio de servicio, instanciamos un objeto de la clase CambioServicio  
                if(tareasOt[i].TareaId === 16 || tareasOt[i].TareaId === 17) {
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
                        abonadoServicio.createdAt = req.body.createdAt;
                        abonadoServicio.createdBy = req.body.createdBy;
                        abonado.ServicioId = req.body.ServicioId;
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
                    }
                }
            }
            return res.status(200).json({msg: 'La OT ha sido finalizada correctamente'})
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: 'Hubo un error al finalizar la OT'});
    }
}

exports.OtObtenerTecnicos = async (req, res) => {
    try {
        const otTecnicos = await knex.select('u.UserId','u.Apellido as ApellidoTecnico', 'u.Nombre as NombreTecnico').from('ot as ot')
        .innerJoin('ottecnico as ott', 'ott.OtId', '=', 'ot.OtId')
        .innerJoin('_user as u', 'u.UserId', 'ott.TecnicoId')
        .where({
            'ot.OtId': req.params.OtId
        })
        res.json(otTecnicos);

    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: 'Hubo un error al obtener la información de la orden de trabajo'});
    }
}

exports.OtObtenerTareas = async (req, res) => {
    try {
        const otTecnicos = await knex.select('t.TareaId', 't.TareaNombre', 't.TareaPrecioUnitario').from('ot as ot')
        .innerJoin('ottarea as ott', 'ott.OtId', '=', 'ot.OtId')
        .innerJoin('tarea as t', 't.TareaId', 'ott.TareaId')
        .where({
            'ot.OtId': req.params.OtId
        })
        res.json(otTecnicos);

    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: 'Hubo un error al obtener la información de la orden de trabajo'});
    }
}



