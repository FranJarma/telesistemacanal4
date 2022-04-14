const db = require('../config/connection');
const options =require('./../config/knex');
const knex = require('knex')(options);
const { validationResult } = require('express-validator');
const Ot = require('../models/Ot');
const UserDomicilio = require('./../models/UserDomicilio');
const UserServicio = require('./../models/UserServicio');
const User = require('./../models/User');
const OtTecnico = require('../models/OtTecnico');
const OtTarea = require('../models/OtTarea');
const Movimiento = require('../models/Movimiento');
const Onu = require('../models/Onu');
const Pago = require('../models/Pago');
const Servicio = require('../models/Servicio');
const VARIABLES = require('./../config/variables');
const { Op } = require('sequelize');

require('dotenv').config({path: 'variables.env'});

exports.OtGet = async(req, res) => {
    try {
        const ot = await knex
        .select('ot.OtId', 'ot.OtFechaPrevistaVisita', 'ot.OtPrimeraVisita', 'ot.OtSegundaVisita', 'ot.OtTerceraVisita', 'ot.OtCuartaVisita',
        'ot.OtObservacionesResponsableEmision', 'ot.OtFechaInicio', 'ot.OtFechaFinalizacion', 'ot.OtRetiraCable', 'ot.OtRetiraOnu',
        'ot.createdAt', 'ot.OtObservacionesResponsableEjecucion', 'ot.OtEsPrimeraBajada', 'ot.NuevoServicioId', 'ot.NuevoDomicilioId',
        'u.Nombre as NombreAbonado', 'u.Apellido as ApellidoAbonado', 'u.OnuId',
        's.ServicioId as ServicioViejoId', 's1.ServicioId as ServicioNuevoId',
        's.ServicioNombre as ServicioViejo', 's1.ServicioNombre as ServicioNuevo',
        'u1.Nombre as NombreResponsableCreacion', 'u1.Apellido as ApellidoResponsableCreacion',
        'u2.Nombre as NombreResponsableEjecucion', 'u2.Apellido as ApellidoResponsableEjecucion', 'u2.UserId as OtResponsableEjecucion' ,
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
        .leftJoin('servicio as s', 's.ServicioId', '=', 'u.ServicioId')
        .leftJoin('servicio as s1', 's1.ServicioId', '=', 'ot.NuevoServicioId')
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
        .select('ot.OtId', 'ot.OtFechaPrevistaVisita', 'ot.OtPrimeraVisita', 'ot.OtSegundaVisita', 'ot.OtTerceraVisita','ot.OtCuartaVisita',
        'ot.OtObservacionesResponsableEmision', 'ot.OtFechaInicio', 'ot.OtFechaFinalizacion', 'ot.OtRetiraCable', 'ot.OtRetiraOnu',
        'ot.createdAt', 'ot.OtObservacionesResponsableEjecucion', 'ot.NuevoServicioId',
        'u.Nombre as NombreAbonado', 'u.Apellido as ApellidoAbonado', 'u.ServicioId',
        'u1.Nombre as NombreResponsableCreacion', 'u1.Apellido as ApellidoResponsableCreacion', 'u.OnuId',
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
            ot.EstadoId = VARIABLES.ESTADO_ID_OT_REGISTRADA;
            ot.OtObservacionesResponsableEmision = req.body.OtObservacionesResponsableEmision;
            ot.OtResponsableEjecucion = req.body.OtResponsableEjecucion.UserId;
            ot.createdBy = req.body.createdBy; //registrada
            await ot.save({transaction: t});
        
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
            ot.EstadoId = VARIABLES.ESTADO_ID_OT_FINALIZADA;
            ot.updatedAt = new Date();
            ot.updatedBy = updatedBy;
            const abonado = await User.findByPk(ot.AbonadoId, {transaction: t});
            const servicio = await Servicio.findByPk(abonado.ServicioId, {transaction: t});
            //INSCRIPCIÓN
            if(ot.OtEsPrimeraBajada) {
                //buscamos el ultimo pago
                let ultimoPagoId = 0;
                const ultimoPago = await Pago.findOne({
                    order: [['PagoId', 'DESC']]
                }); 
                if (ultimoPago) ultimoPagoId = ultimoPago.PagoId;
                abonado.FechaBajada = OtFechaFinalizacion;
                abonado.EstadoId = VARIABLES.ESTADO_ID_ABONADO_ACTIVO;
                const diaActual = new Date().getDate();
                const mesActual = new Date().getMonth()+1;
                const ultimoDiaDelMes = new Date(new Date().getFullYear(), new Date().getMonth()+1, 0).getDate();
                let pago1 = null;
                let pago2 = null;
                let pago3 = null;
                FechaVencimientoServicio = OtFechaFinalizacion.replace(añoFechaFinalizacion, añoFechaFinalizacion + 2);
                //Registramos los pagos vacíos de 2 años
                for(let i= 1; i<=12; i++) {
                    if(i==mesActual && diaActual >=15) {
                        pago1 = {
                            PagoId: ultimoPagoId + 1,
                            PagoSaldo: (ultimoDiaDelMes - diaActual) * servicio.ServicioMultiplicadorPrimerMes, //precio mensual del servicio,
                            PagoTotal: (ultimoDiaDelMes - diaActual) * servicio.ServicioMultiplicadorPrimerMes,
                            PagoRecargo: 0,
                            PagoAño: new Date().getFullYear(),
                            PagoMes: i,
                            createdAt: new Date(),
                            createdBy: updatedBy,
                            UserId: abonado.UserId,
                            PagoConceptoId: VARIABLES.ID_CONCEPTO_COBRO_MENSUALIDAD
                        }
                        const newPago1 = new Pago(pago1);
                        await newPago1.save({transaction: t});
                        ultimoPagoId = ultimoPagoId + 1;
                    }
                    if(i>mesActual) {
                        pago1 = {
                            PagoId: ultimoPagoId + 1,
                            PagoSaldo: servicio.ServicioPrecioUnitario, //precio mensual del servicio,
                            PagoTotal: servicio.ServicioPrecioUnitario,
                            PagoRecargo: 0,
                            PagoAño: new Date().getFullYear(),
                            PagoMes: i,
                            createdAt: new Date(),
                            createdBy: updatedBy,
                            UserId: abonado.UserId,
                            PagoConceptoId: VARIABLES.ID_CONCEPTO_COBRO_MENSUALIDAD
                        }
                        const newPago1 = new Pago(pago1);
                        await newPago1.save({transaction: t});
                        ultimoPagoId = ultimoPagoId + 1;
                    }
                }
                for(let i= 1; i<=12; i++) {
                    pago2 = {
                        PagoId: ultimoPagoId + 1,
                        PagoSaldo: servicio.ServicioPrecioUnitario, //precio mensual del servicio,
                        PagoTotal: servicio.ServicioPrecioUnitario,
                        PagoRecargo: 0,
                        PagoAño: new Date().getFullYear()+1,
                        PagoMes: i,
                        createdAt: new Date(),
                        createdBy: updatedBy,
                        UserId: abonado.UserId,
                        PagoConceptoId: VARIABLES.ID_CONCEPTO_COBRO_MENSUALIDAD
                    }
                    const newPago2 = new Pago(pago2);
                    await newPago2.save({transaction: t});
                    ultimoPagoId = ultimoPagoId + 1;
                }
                for(let i= 1; i<=12; i++) {
                    if(i<=mesActual) {
                        pago3 = {
                            PagoId: ultimoPagoId + 1,
                            PagoSaldo: servicio.ServicioPrecioUnitario, //precio mensual del servicio,
                            PagoTotal: servicio.ServicioPrecioUnitario,
                            PagoRecargo: 0,
                            PagoAño: new Date().getFullYear()+2,
                            PagoMes: i,
                            createdAt: new Date(),
                            createdBy: updatedBy,
                            UserId: abonado.UserId,
                            PagoConceptoId: VARIABLES.ID_CONCEPTO_COBRO_MENSUALIDAD
                        }
                        const newPago3 = new Pago(pago3);
                        await newPago3.save({transaction: t});
                        ultimoPagoId = ultimoPagoId + 1;
                    }
                }
                //si es combo o internet, asignamos ONU
                if(abonado.ServicioId !== 1) {
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
                        OtId: ot.OtId
                    }
                }, {transaction: t});
                userDomicilio.CambioDomicilioObservaciones = `Cambio correcto, ot n°:${ot.OtId}`;
                abonado.DomicilioId = ot.NuevoDomicilioId;
                await userDomicilio.save({transaction: t});
                await abonado.save({transaction: t});
            }
            //CAMBIO DE SERVICIO
            if(ot.NuevoServicioId !== null) {
                const nuevoServicio = await Servicio.findByPk(ot.NuevoServicioId, {transaction: t});
                //si el abonado elije internet o combo, y no tiene onu, le asignamos una
                if(ot.NuevoServicioId !== 1 && !abonado.OnuId) {
                    const onu = await Onu.findByPk(req.body.Onu.OnuId, {transaction: t});
                    onu.EstadoId = 4;
                    await onu.save({transaction: t});
                    abonado.OnuId = onu.OnuId;
                }
                //si el abonado elije cable y tiene ONU, se la desasignamos
                if(ot.NuevoServicioId === 1 && abonado.OnuId){
                    const onuAbonado = await Onu.findByPk(abonado.OnuId, {transaction: t});
                    onuAbonado.EstadoId = 5;
                    await onuAbonado.save({transaction: t});
                    abonado.OnuId = null;
                }
                const userServicio = await UserServicio.findOne({
                    where: {
                        OtId: ot.OtId
                    },
                    order: [ [ 'UserServicioId', 'DESC' ]],
                }, {transaction: t});
                userServicio.CambioServicioObservaciones = `Cambio correcto, ot n°:${ot.OtId}`;
                abonado.ServicioId = ot.NuevoServicioId;
                await userServicio.save({transaction: t});
                await abonado.save({transaction: t});
                //CAMBIAR TODOS LOS MONTOS DE LOS PAGOS PENDIENTES
                await Pago.update(
                    {
                        PagoTotal: nuevoServicio.ServicioPrecioUnitario,
                        PagoSaldo: nuevoServicio.ServicioPrecioUnitario
                    },
                    {
                        where: {
                            UserId: abonado.UserId,
                            PagoSaldo: {
                                [Op.gt]: 0
                            },
                            PagoConceptoId: VARIABLES.ID_CONCEPTO_COBRO_MENSUALIDAD
                        }
                    },
                {transaction: t});
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
                movimiento.AbonadoId = abonado.UserId;
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



