const db = require('../config/connection');
const options =require('./../config/knex');
const knex = require('knex')(options);
const DetallePago = require('./../models/DetallePago');
const Pago = require('./../models/Pago');

require('dotenv').config({path: 'variables.env'});

exports.DetallesPagoListar = async(req,res) => {
    try {
        const detallesPagos = await knex.select('dp.DetallePagoMonto','dp.createdAt','mc.MovimientoConceptoNombre',
        'mp.MedioPagoNombre', 'u.Nombre', 'u.Apellido').from('detallepago as dp')
        .innerJoin('mediopago as mp','dp.MedioPagoId', '=', 'mp.MedioPagoId')
        .innerJoin('_user as u', 'u.UserId', '=', 'dp.createdBy')
        .innerJoin('movimiento as m', 'dp.MovimientoId', '=', 'm.MovimientoId')
        .innerJoin('movimientoConcepto as mc', 'mc.MovimientoConceptoId', '=', 'm.MovimientoConceptoId')
        .where({
            'dp.PagoId': req.params.id,
            'dp.deletedAt': null
        })
        .orderBy('dp.createdAt', 'desc');
        res.json(detallesPagos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error al encontrar los detalles del pago'});
    }
}

exports.DetallePagoDelete = async(req, res) => {
    try {
        await db.transaction(async(t)=> {
            const detallePago = await DetallePago.findByPk(req.body.DetallePagoId, {transaction: t});
            //buscamos el PAGO y actualizamos el saldo
            const pago = await Pago.findByPk(req.body.PagoId, {transaction: t});
            let saldo = pago.PagoSaldo;
            pago.PagoSaldo = saldo + req.body.DetallePagoMonto;
            await detallePago.update(req.body, {transaction: t});
            await pago.save({transaction: t});
            return res.status(200).json({msg: 'El detalle del pago ha sido eliminado correctamente'})
        })
    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error al eliminar el detalle de pago');
    }
}