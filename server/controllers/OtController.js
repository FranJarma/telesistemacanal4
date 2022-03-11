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
const Movimiento = require('../models/Movimiento');
const Onu = require('../models/Onu');

require('dotenv').config({path: 'variables.env'});

exports.OtGet = async(req, res) => {
    try {
        const ot = await knex
        .select('ot.OtId', 'ot.OtFechaPrevistaVisita', 'ot.OtPrimeraVisita', 'ot.OtSegundaVisita', 'ot.OtTerceraVisita', 'ot.OtCuartaVisita',
        'ot.OtObservacionesResponsableEmision', 'ot.OtFechaInicio', 'ot.OtFechaFinalizacion', 'ot.OtRetiraCable', 'ot.OtRetiraOnu',
        'ot.createdAt', 'ot.OtObservacionesResponsableEjecucion', 'ot.OtEsPrimeraBajada', 'ot.NuevoServicioId',
        'u.Nombre as NombreAbonado', 'u.Apellido as ApellidoAbonado', 'u.ServicioId',
        'u1.Nombre as NombreResponsableCreacion', 'u1.Apellido as ApellidoResponsableCreacion',
        'u2.Nombre as NombreResponsableEjecucion', 'u2.Apellido as ApellidoResponsableEjecucion',
        'd.DomicilioCalle', 'd.DomicilioNumero', 'd1.DomicilioCalle as DomicilioCalleCambio', 'd1.DomicilioNumero as DomicilioNumeroCambio',
        'b.BarrioId', 'b.BarrioNombre', 'm.MunicipioId', 'm.MunicipioNombre',
        'b1.BarrioNombre as BarrioNombreCambio', 'm.MunicipioNombre as MunicipioNombreCambio'
        )
        .sum('t.TareaPrecioOt as Monto')
        .from('ot as ot')
        .innerJoin('_user as u', 'u.UserId', '=', 'ot.AbonadoId')
        .innerJoin('_user as u1', 'u1.UserId', '=', 'ot.createdBy')
        .innerJoin('_user as u2', 'u2.UserId', '=', 'ot.OtResponsableEjecucion')
        .innerJoin('domicilio as d', 'u.DomicilioId', '=', 'd.DomicilioId')
        .innerJoin('barrio as b', 'b.BarrioId', '=', 'd.BarrioId')
        .innerJoin('municipio as m', 'b.MunicipioId', '=', 'm.MunicipioId')
        .leftJoin('domicilio as d1', 'ot.NuevoDomicilioId', '=', 'd1.DomicilioId')
        .leftJoin('barrio as b1', 'b1.BarrioId', '=', 'd1.BarrioId')
        .leftJoin('municipio as m1', 'b1.MunicipioId', '=', 'm1.MunicipioId')
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

exports.OtGetByTecnico = async(req, res) => {
    try {
        const ot = await knex
        .select('ot.OtId', 'ot.OtFechaPrevistaVisita', 'ot.OtPrimeraVisita', 'ot.OtSegundaVisita', 'ot.OtTerceraVisita', 'ot.OtCuartaVisita',
        'ot.OtObservacionesResponsableEmision', 'ot.OtFechaInicio', 'ot.OtFechaFinalizacion', 'ot.OtRetiraCable', 'ot.OtRetiraOnu',
        'ot.createdAt', 'ot.OtObservacionesResponsableEjecucion', 'ot.NuevoServicioId',
        'u.Nombre as NombreAbonado', 'u.Apellido as ApellidoAbonado', 'u.ServicioId',
        'u1.Nombre as NombreResponsableCreacion', 'u1.Apellido as ApellidoResponsableCreacion',
        'd.DomicilioCalle', 'd.DomicilioNumero', 'b.BarrioId', 'b.BarrioNombre', 'm.MunicipioId', 'm.MunicipioNombre'
        )
        .sum('t.TareaPrecioOt as Monto')
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
            'ot.OtResponsableEjecucion': req.params.tecnicoId,
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
        const { OtId, OtFechaInicio, OtFechaFinalizacion, OtObservacionesResponsableEjecucion, Monto, updatedBy } = req.body;
        const añoFechaFinalizacion = parseInt(OtFechaFinalizacion.split('-')[0]);
        let FechaVencimientoServicio = "";

        await db.transaction(async (t)=> {
            if( OtFechaInicio >= OtFechaFinalizacion ) return res.status(400).send({msg: 'La hora de Inicio no puede ser mayor o igual a la de finalización'});
            const ot = await Ot.findByPk(OtId, {transaction: t});
            ot.OtFechaInicio = OtFechaInicio;
            ot.OtFechaFinalizacion = OtFechaFinalizacion;
            ot.OtObservacionesResponsableEjecucion = OtObservacionesResponsableEjecucion;
            ot.EstadoId = process.env.ESTADO_ID_OT_FINALIZADA;
            ot.updatedAt = new Date();
            ot.updatedBy = updatedBy;
            const abonado = await User.findByPk(ot.AbonadoId, {transaction: t});
            //INSCRIPCIÓN
            if(ot.OtEsPrimeraBajada) {
                abonado.FechaBajada = OtFechaFinalizacion;
                abonado.EstadoId = process.env.ESTADO_ID_ABONADO_ACTIVO;
                if(abonado.ServicioId === 1) {
                    FechaVencimientoServicio = OtFechaFinalizacion.replace(añoFechaFinalizacion, añoFechaFinalizacion + 1);
                }
                else {
                    FechaVencimientoServicio = OtFechaFinalizacion.replace(añoFechaFinalizacion, añoFechaFinalizacion + 2);
                    const onu = await Onu.findByPk(req.body.Onu.OnuId, {transaction: t});
                    onu.EstadoId = 4;
                    await onu.save({transaction: t});

                    abonado.OnuId = onu.OnuId;
                }
                abonado.FechaVencimientoServicio = FechaVencimientoServicio;
                await abonado.save({transaction: t});
            }
            await ot.save({transaction: t});
            //CAMBIO DE DOMICILIO
            if(ot.NuevoDomicilioId !== null) {
                const userDomicilio = await UserDomicilio.findOne({
                    where: {
                        DomicilioId: ot.NuevoDomicilioId
                    }
                }, {transaction: t});
                userDomicilio.CambioDomicilioObservaciones = `Cambio correcto, ot n°:${ot.OtId}`;
                abonado.DomicilioId = ot.NuevoDomicilioId;
                await userDomicilio.save({transaction: t});
                await abonado.save({transaction: t});
            }
            //CAMBIO DE SERVICIO
            if(ot.NuevoServicioId !== null) {
                if(ot.NuevoServicioId !== 1) {
                    const onu = await Onu.findByPk(req.body.Onu.OnuId, {transaction: t});
                    onu.EstadoId = 4;
                    await onu.save({transaction: t});

                    abonado.OnuId = onu.OnuId;
                }
                const userServicio = await UserServicio.findOne({
                    where: {
                        ServicioId: ot.NuevoServicioId,
                        UserId: abonado.UserId
                    },
                    order: [ [ 'UserServicioId', 'DESC' ]],
                }, {transaction: t});
                userServicio.CambioServicioObservaciones = `Cambio correcto, ot n°:${ot.OtId}`;
                abonado.ServicioId = ot.NuevoServicioId;
                await userServicio.save({transaction: t});
                await abonado.save({transaction: t});
            }
            if(Monto > 0) {
                //buscamos el ultimo Movimiento
                let ultimoMovimientoId = 0;
                const ultimoMovimiento = await Movimiento.findOne({
                    order: [['MovimientoId', 'DESC']]
                }); 
                if (ultimoMovimiento) ultimoMovimientoId = ultimoMovimiento.MovimientoId;
                //instanciamos un nuevo movimiento
                const movimiento = new Movimiento({transaction: t});
                movimiento.MovimientoId = ultimoMovimientoId + 1;
                movimiento.MovimientoCantidad = Monto;
                movimiento.MovimientoDia = new Date().getDate();
                movimiento.MovimientoMes = new Date().getMonth()+1;
                movimiento.MovimientoAño = new Date().getFullYear();
                movimiento.MovimientoConceptoId = 2;
                movimiento.createdBy = updatedBy;
                movimiento.OtId = OtId;
                await movimiento.save({transaction: t});
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



