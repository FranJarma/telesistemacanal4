const db = require('./../config/connection');
const options =require('./../config/knex');
const knex = require('knex')(options);
const { validationResult } = require('express-validator');
const Pago = require('./../models/Pago');
const DetallePago = require('./../models/DetallePago');
const Movimiento = require('../models/Movimiento');

require('dotenv').config({path: 'variables.env'});

exports.PagosListarPorUsuario = async(req,res) => {
    try {
        const pagos = await knex.select('*').from('pago as p')
        .innerJoin('movimientoconcepto as mc', 'p.PagoConceptoId', '=', 'mc.MovimientoConceptoId')
        .where(
            {'p.UserId': req.params.UserId,
            'p.PagoAño': req.params.Periodo,
            'p.PagoConceptoId': req.params.Periodo.split('=')[1]
        })
        .orderBy([{ column: 'PagoAño', order: 'desc' }, { column: 'PagoMes', order: 'asc' }])
        res.json(pagos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error al encontrar los pagos del abonado'});
    }
}
exports.PagosMensualesPendientes = async(req,res) => {
    try {
        if(req.params.Cantidad) {
            const cantidadPagos = await knex('pago as p')
            .innerJoin('movimientoconcepto as mc', 'p.PagoConceptoId', '=', 'mc.MovimientoConceptoId')
            .where(
                {'p.UserId': req.params.UserId
            })
            .andWhere('p.PagoSaldo', '>', '0')
            .count('p.PagoId', {as: 'pagos'})
            .first();
            res.json(cantidadPagos.pagos);
        }

        if(req.params.top !== null) {
            const pagos = await knex.select('*').from('pago as p')
            .innerJoin('movimientoconcepto as mc', 'p.PagoConceptoId', '=', 'mc.MovimientoConceptoId')
            .where(
                {'p.UserId': req.params.UserId
            })
            .andWhere('p.PagoSaldo', '>', '0')
            .limit(req.params.top)
            .offset(0)
            .orderBy([{ column: 'PagoAño', order: 'asc' }, { column: 'PagoMes', order: 'asc' }])
            res.json(pagos);
        }
        else {
            const pagosAll = await knex.select('*').from('pago as p')
            .innerJoin('movimientoconcepto as mc', 'p.PagoConceptoId', '=', 'mc.MovimientoConceptoId')
            .where(
                {'p.UserId': req.params.UserId
            })
            .andWhere('p.PagoSaldo', '>', '0')
            .orderBy([{ column: 'PagoAño', order: 'asc' }, { column: 'PagoMes', order: 'asc' }])
            res.json(pagosAll);
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error al encontrar los pagos del abonado'});
    }
}

exports.PagoGet = async(req,res) => {
    try {
        const pago = await knex.select('*').from('pago as p')
        .innerJoin('movimientoconcepto as mc', 'p.PagoConceptoId', '=', 'mc.MovimientoConceptoId')
        .where({
            'p.UserId': req.query.UserId,
            'p.PagoAño': req.query.PagoPeriodo.split('-')[0],
            'p.PagoMes': req.query.PagoPeriodo.split('-')[1]
        })
        .first();
        res.json(pago);
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error al consultar el pago de este período'})
    }
}
exports.PagoCreate = async(req,res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    if(req.body.DetallePagoMonto <= 0) return res.status(400).json({msg: 'El monto tiene que ser mayor a 0'});
    try {
        await db.transaction(async(t)=>{
            //buscamos el ultimo Movimiento
            let ultimoMovimientoId = 0;
            const ultimoMovimiento = await Movimiento.findOne({
                order: [['MovimientoId', 'DESC']]
            }); 
            if (ultimoMovimiento) ultimoMovimientoId = ultimoMovimiento.MovimientoId;

            let ultimoDetallePagoId = 0;
            //Buscamos el último DetallePago
            const ultimoDetallePago = await DetallePago.findOne({
                order: [['DetallePagoId', 'DESC']]
            });
            if (ultimoDetallePago) ultimoDetallePagoId = ultimoDetallePago.DetallePagoId;
            //buscamos si hay un pago registrado con ese UserId y esa fecha
            const pagoBuscar = await Pago.findOne({
                where: {
                    PagoId: req.body.PagoInfo.PagoId
                }
            })
            //instanciamos un nuevo movimiento
            const movimiento = new Movimiento({transaction: t});
            movimiento.MovimientoId = ultimoMovimientoId + 1;
            movimiento.MunicipioId = req.body.MunicipioId;
            movimiento.MovimientoCantidad = parseInt(req.body.PagoInfo.DetallePagoMonto);
            movimiento.createdBy = req.body.PagoInfo.createdBy;
            movimiento.MovimientoDia = new Date().getDate();
            movimiento.MovimientoMes = new Date().getMonth()+1;
            movimiento.MovimientoAño = new Date().getFullYear();
            movimiento.MovimientoConceptoId = 1;
            //si encuentra el pago, NO se lo registra de nuevo, sino que solo se registra un nuevo detalle de pago y se actualiza el saldo
            if(pagoBuscar) {
                //verificamos que el monto ingresado no supere el saldo restante
                if(req.body.DetallePagoMonto > pagoBuscar.PagoSaldo) return res.status(400).json({msg: `El monto no puede ser mayor al saldo restante de: $ ${pagoBuscar.PagoSaldo}`})
                pagoBuscar.PagoSaldo = parseInt(pagoBuscar.PagoSaldo) - parseInt(req.body.PagoInfo.DetallePagoMonto);
                pagoBuscar.updatedBy = req.body.PagoInfo.updatedBy;
                const detallePago = new DetallePago(req.body, {transaction: t});
                detallePago.DetallePagoId = ultimoDetallePagoId + 1;
                detallePago.PagoId = pagoBuscar.PagoId;
                detallePago.MedioPagoId = req.body.MedioPagoId;
                detallePago.DetallePagoMonto = req.body.PagoInfo.DetallePagoMonto;
                detallePago.DetallePagoMotivo = 'Pago mensual';
                detallePago.createdAt = new Date();
                detallePago.createdBy = req.body.PagoInfo.createdBy;
                //registramos el id del detalle del pago pago al movimiento
                movimiento.DetallePagoId = detallePago.DetallePagoId;
                await pagoBuscar.save({transaction: t});
                await detallePago.save({transaction: t});
                await movimiento.save({transaction: t});
            }
            else {
            //si no encuentra el pago
                res.status(400).json({msg: 'No se encontró el pago correspondiente'});
            }
            return res.status(200).json({msg: 'El Pago ha sido registrado correctamente'})
        })
        }   
    catch (error) {
        console.log(error);
        res.status(400).json({msg: 'Hubo un error al registrar el pago'});
    }
}

exports.PagoAñadirRecargo = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
        await db.transaction(async(t)=>{
            const { PagoId, PagoRecargo, updatedBy } = req.body;
            const pago = await Pago.findByPk(PagoId, {transaction: t});
            const diaActual = new Date().getDate();
            const mesActual = new Date().getMonth() + 1;
            const añoActual = new Date().getFullYear();
            if(PagoRecargo <= 0) return res.status(400).json({msg: 'El recargo no puede ser menor o igual a 0'});
            //validar números congruentes
            if(PagoRecargo >= 2000) return res.status(400).json({msg: 'Ingrese un monto menor'});
            //validar que el pago no esté completo
            if(pago.PagoSaldo === 0) return res.status(400).json({msg: 'El mes está saldado. No es posible añadir recargo'});
            //validar que el recargo se haga en la fecha correcta
            if((diaActual < 21 && mesActual === pago.PagoMes && añoActual === pago.PagoAño)) return res.status(400).json({msg: 'No corresponde añadir recargo al mes seleccionado'});
            if((mesActual > pago.PagoMes && añoActual === pago.PagoAño)) return res.status(400).json({msg: 'No es posible añadir recargo a un mes posterior al actual'});
            
            pago.PagoRecargo = pago.PagoRecargo + parseInt(PagoRecargo);
            pago.PagoSaldo = pago.PagoSaldo + parseInt(PagoRecargo);
            pago.updatedAt = new Date();
            pago.updatedBy = updatedBy;
            await pago.save({transaction: t});
            return res.status(200).json({msg: 'El Recargo del pago ha sido registrado correctamente'})

        })
    } catch (error) {
        console.log(error);
        res.status(400).json({msg: 'Hubo un error al añadir el recargo'});
    }
}

exports.PagoEliminarRecargo = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
        await db.transaction(async(t)=>{
            const { PagoId, updatedBy } = req.body;
            const pago = await Pago.findByPk(PagoId, {transaction: t});
            if(pago.PagoSaldo === 0) return res.status(400).json({msg: 'El mes está saldado.'});
            if(pago.PagoRecargo === 0) return res.status(400).json({msg: 'El mes no tiene recargo asociado.'});
            pago.PagoSaldo = pago.PagoSaldo - pago.PagoRecargo;
            pago.PagoRecargo = 0;
            pago.updatedAt = new Date();
            pago.updatedBy = updatedBy;
            await pago.save({transaction: t});
            return res.status(200).json({msg: 'El Recargo del pago ha sido eliminado correctamente'})
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({msg: 'Hubo un error al eliminar el recargo'});
    }
}

exports.PagosTraerInscripcion = async(req,res) => {
    try {
        const inscripcion = await knex.select('p.PagoTotal', 'p.PagoSaldo', 'dp.DetallePagoMonto',
        'dp.createdAt', 'u.Nombre', 'u.Apellido', 'dp.MedioPagoId', 'mp.MedioPagoNombre', 'mp.MedioPagoCantidadCuotas').from('pago as p')
        .innerJoin('detallepago as dp', 'p.PagoId', '=', 'dp.PagoId')
        .innerJoin('_user as u', 'u.UserId', '=', 'dp.createdBy')
        .innerJoin('mediopago as mp', 'mp.MedioPagoId', '=', 'dp.MedioPagoId')
        .where(
            {
                'p.UserId': req.params.UserId,
                'dp.DetallePagoMotivo': 'Inscripción'
            })
        res.json(inscripcion);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error al encontrar los pagos del abonado'});
    }
}

exports.PagoAñadirCuota = async(req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
        await db.transaction(async(t)=>{
            //buscamos el pago
            const pago = await Pago.findByPk(req.body.PagoId, {transaction: t});
            if(pago.PagoSaldo == 0) {
                return res.status(400).json({msg: 'El mes está saldado.'});
            }
            //buscamos el ultimo Movimiento
            let ultimoMovimientoId = 0;
            const ultimoMovimiento = await Movimiento.findOne({
                order: [['MovimientoId', 'DESC']]
            }); 
            if (ultimoMovimiento) ultimoMovimientoId = ultimoMovimiento.MovimientoId;

            let ultimoDetallePagoId = 0;
            //Buscamos el último DetallePago
            const ultimoDetallePago = await DetallePago.findOne({
                order: [['DetallePagoId', 'DESC']]
            });
            if (ultimoDetallePago) ultimoDetallePagoId = ultimoDetallePago.DetallePagoId;
            pago.updatedAt = new Date();
            pago.updatedBy = req.body.updatedBy;
            pago.PagoSaldo = pago.PagoSaldo - req.body.DetallePagoMonto;
            //buscamos el ultimo detalle de pago para hacer una copia del mismo
            const detallePago = await DetallePago.findOne({
                where: {
                    PagoId: pago.PagoId
                },
                order: [['DetallePagoId', 'DESC']]
            })
            const nuevoDetallePago = new DetallePago({transaction: t});
            nuevoDetallePago.DetallePagoId = ultimoDetallePagoId + 1;
            nuevoDetallePago.DetallePagoMonto = detallePago.DetallePagoMonto;
            nuevoDetallePago.DetallePagoMotivo = detallePago.DetallePagoMotivo;
            nuevoDetallePago.PagoId = detallePago.PagoId;
            nuevoDetallePago.MedioPagoId = detallePago.MedioPagoId;
            nuevoDetallePago.createdAt = new Date();
            nuevoDetallePago.createdBy = req.body.createdBy;
            //instanciamos un nuevo movimiento
            const movimiento = new Movimiento({transaction: t});
            movimiento.MovimientoId = ultimoMovimientoId + 1;
            movimiento.MovimientoCantidad = req.body.DetallePagoMonto;
            movimiento.createdBy = req.body.createdBy;
            movimiento.MovimientoDia = new Date().getDate();
            movimiento.MovimientoMes = new Date().getMonth()+1;
            movimiento.MovimientoAño = new Date().getFullYear();
            movimiento.MunicipioId = req.body.MunicipioId;
            movimiento.MovimientoConceptoId = 1;
            movimiento.DetallePagoId = nuevoDetallePago.DetallePagoId;
            await pago.save({transaction: t});
            await nuevoDetallePago.save({transaction: t});
            await movimiento.save({transaction: t});
            return res.status(200).json({msg: 'La cuota del pago ha sido registrada correctamente'})
        })
        }   
    catch (error) {
        console.log(error);
        res.status(400).json({msg: 'Hubo un error al registrar el pago'});
    }
}