const db = require('./../config/connection');
const options =require('./../config/knex');
const knex = require('knex')(options);

require('dotenv').config({path: 'variables.env'});

exports.FacturasListarPorUsuario = async(req,res) => {
    try {
        const facturas = await knex
        .select('f.FacturaNumeroComprobante', 'f.FacturaCodigoAutorizacion', 'f.FacturaTipoCodigoAutorizacion',
        'f.FacturaImporte', 'f.FacturaVersion', 'f.FacturaCuitEmisor', 'f.FacturaPuntoVenta', 'f.FacturaFechaEmision',
        'f.FacturaTipoComprobante', 'f.FacturaMoneda', 'f.FacturaCotizacion', 'f.FacturaTipoDocReceptor',
        'f.FacturaNroDocReceptor', 'f.FacturaFechaVencimientoCodigoAutorizacion', 'u.Nombre', 'u.Apellido',
        'u1.Nombre as NombreAbonado', 'u1.Apellido as ApellidoAbonado', 'd.DomicilioCalle', 'd.DomicilioNumero', 'b.BarrioNombre',
        'mc.MovimientoConceptoNombre', 'mc.MovimientoConceptoId', 'm.MovimientoCantidad', 'dp.DetallePagoMonto', 'dp.DetallePagoObservaciones')
        // ['str.id', knex.raw('ARRAY_AGG(att.*) as attachments')])
        .from('factura as f')
        .innerJoin('_user as u', 'u.UserId', '=', 'f.createdBy')
        .innerJoin('_user as u1', 'u1.UserId', '=', 'f.AbonadoId')
        .innerJoin('domicilio as d', 'u1.DomicilioId', '=', 'd.DomicilioId')
        .innerJoin('barrio as b', 'b.BarrioId', '=', 'd.BarrioId')
        .innerJoin('movimiento as m', 'm.FacturaId', '=', 'f.FacturaId')
        .innerJoin('movimientoConcepto as mc', 'mc.MovimientoConceptoId', '=', 'm.MovimientoConceptoId')
        .innerJoin('detallePago as dp', 'dp.MovimientoId', '=', 'm.MovimientoId')
        .where(
            {'f.AbonadoId': req.params.UserId,
            'f.FacturaAño': req.params.Periodo,
        })
        .orderBy('f.FacturaFechaEmision', 'DESC')
        // .groupBy('str.id')  
        res.json(facturas);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error al encontrar las facturas del abonado'});
    }
}
