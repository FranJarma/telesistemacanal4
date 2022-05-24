const db = require('../config/connection');
const options =require('./../config/knex');
const knex = require('knex')(options);
const DetallePago = require('./../models/DetallePago');
const Pago = require('./../models/Pago');

require('dotenv').config({path: 'variables.env'});

exports.DetallesPagoListar = async(req,res) => {
    try {
        const detallesPagos = await knex.select('dp.DetallePagoId','dp.DetallePagoMonto','dp.createdAt', 'mc.MovimientoConceptoId',
        'mc.MovimientoConceptoNombre', 'mp.MedioPagoNombre', 'u.Nombre as NombreCarga', 'u.Apellido as ApellidoCarga',
        'm.FacturaId', 'm.ReciboId', 'u1.Nombre as NombreAbonado', 'u1.Cuit', 'u1.Apellido as ApellidoAbonado', 'd.DomicilioCalle',
        'd.DomicilioNumero', 'b.BarrioNombre', 'mu.MunicipioNombre', 'm.MovimientoCantidad',
        'f.FacturaNumeroComprobante', 'f.FacturaCodigoAutorizacion', 'f.FacturaTipoCodigoAutorizacion',
        'f.FacturaImporte', 'f.FacturaVersion', 'f.FacturaCuitEmisor', 'f.FacturaPuntoVenta', 'f.FacturaFechaEmision',
        'f.FacturaTipoComprobante', 'f.FacturaMoneda', 'f.FacturaCotizacion', 'f.FacturaTipoDocReceptor',
        'f.FacturaNroDocReceptor', 'f.FacturaFechaVencimientoCodigoAutorizacion')
        .from('detallepago as dp')
        .innerJoin('mediopago as mp','dp.MedioPagoId', '=', 'mp.MedioPagoId')
        .innerJoin('_user as u', 'u.UserId', '=', 'dp.createdBy')
        .innerJoin('movimiento as m', 'dp.MovimientoId', '=', 'm.MovimientoId')
        .innerJoin('movimientoConcepto as mc', 'mc.MovimientoConceptoId', '=', 'm.MovimientoConceptoId')
        .innerJoin('_user as u1', 'u1.UserId', 'm.AbonadoId')
        .innerJoin('domicilio as d', 'd.DomicilioId', '=', 'u1.DomicilioId')
        .innerJoin('barrio as b', 'b.BarrioId', '=', 'd.BarrioId')
        .innerJoin('municipio as mu', 'mu.MunicipioId', '=', 'b.MunicipioId')
        .leftJoin('factura as f', 'f.FacturaId', '=', 'm.FacturaId')

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