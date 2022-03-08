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
        .orderBy([{ column: 'PagoAño', order: 'desc' }, { column: 'PagoMes', order: 'desc' }])
        res.json(pagos);
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
                    UserId: req.body.UserId,
                    PagoAño: req.body.PagoPeriodo.split('-')[0],
                    PagoMes: req.body.PagoPeriodo.split('-')[1]
                }
            })
            //instanciamos un nuevo movimiento
            const movimiento = new Movimiento({transaction: t});
            movimiento.MovimientoId = ultimoMovimientoId + 1;
            movimiento.MovimientoCantidad = req.body.DetallePagoMonto;
            movimiento.createdBy = req.body.createdBy;
            movimiento.MovimientoDia = new Date().getDate();
            movimiento.MovimientoMes = new Date().getMonth()+1;
            movimiento.MovimientoAño = new Date().getFullYear();
            movimiento.MovimientoConceptoId = 1;
            //si encuentra el pago, NO se lo registra de nuevo, sino que solo se registra un nuevo detalle de pago y se actualiza el saldo
            if(pagoBuscar) {
                //verificamos que el monto ingresado no supere el saldo restante
                if(req.body.DetallePagoMonto > pagoBuscar.PagoSaldo) return res.status(400).json({msg: `El monto no puede ser mayor al saldo restante de: $ ${pagoBuscar.PagoSaldo}`})
                pagoBuscar.PagoSaldo = pagoBuscar.PagoSaldo - req.body.DetallePagoMonto;
                const detallePago = new DetallePago(req.body, {transaction: t});
                detallePago.DetallePagoId = ultimoDetallePagoId + 1;
                detallePago.PagoId = pagoBuscar.PagoId;
                //registramos el id del pago al movimiento
                movimiento.PagoId = pagoBuscar.PagoId;
                await pagoBuscar.save({transaction: t});
                await detallePago.save({transaction: t});
                await movimiento.save({transaction: t});
            }
            else {
            //si no encuentra el pago, se lo registra desde 0, con un nuevo detalle de pago
                let ultimoPagoId = 0;
                const ultimoPago = await Pago.findOne({
                    order: [['PagoId', 'DESC']],
                });
                if (ultimoPago) ultimoPagoId = ultimoPago.PagoId;
                const pago = new Pago(req.body, {transaction: t});
                pago.PagoId = ultimoPagoId + 1;
                pago.PagoSaldo = req.body.PagoTotal - req.body.DetallePagoMonto;
                pago.PagoAño = req.body.PagoPeriodo.split('-')[0];
                pago.PagoMes = req.body.PagoPeriodo.split('-')[1];
                const detallePago = new DetallePago(req.body, {transaction: t});
                detallePago.DetallePagoId = ultimoDetallePagoId + 1;
                detallePago.PagoId = ultimoPagoId + 1;
                //registramos el pago id del movimiento
                movimiento.PagoId = pago.PagoId;
                await pago.save({transaction: t});
                await detallePago.save({transaction: t});
                await movimiento.save({transaction: t});
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