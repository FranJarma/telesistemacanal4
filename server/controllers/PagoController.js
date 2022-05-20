const db = require('./../config/connection');
const options =require('./../config/knex');
const knex = require('knex')(options);
const { validationResult } = require('express-validator');
const Pago = require('./../models/Pago');
const User = require('./../models/User');
const DetallePago = require('./../models/DetallePago');
const Movimiento = require('../models/Movimiento');
const Servicio = require('../models/Servicio');
const Factura = require('./../models/Factura');
const Afip = require('@afipsdk/afip.js');

const date = new Date(Date.now() - ((new Date()).getTimezoneOffset() * 60000)).toISOString().split('T')[0];
const afip = new Afip({ CUIT: 30687336506, cert: "tls_pem.pem", key: "tls_key.key", res_folder: './', production: 'false' });

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
        if(req.params.top !== null) {
            const pagos = await knex.select('*').from('pago as p')
            .innerJoin('movimientoconcepto as mc', 'p.PagoConceptoId', '=', 'mc.MovimientoConceptoId')
            .where(
                {'p.UserId': req.params.UserId,
                'p.PagoConceptoId': req.params.Concepto
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
            //buscamos si hay un pago registrado con ese PagoId
            const pagoBuscar = await Pago.findOne({
                where: {
                    PagoId: req.body.PagoInfo.PagoId
                }
            })
            const abonado = await User.findOne({
                where: {
                    UserId: req.body.PagoInfo.UserId
                }
            })
            //instanciamos un nuevo movimiento
            const movimiento = new Movimiento({transaction: t});
            movimiento.MovimientoId = ultimoMovimientoId + 1;
            movimiento.MunicipioId = req.body.MunicipioId;
            movimiento.MovimientoCantidad = req.body.PagoInfo.DetallePagoMonto;
            movimiento.createdBy = req.body.PagoInfo.createdBy;
            movimiento.MovimientoDia = new Date().getDate();
            movimiento.MovimientoMes = new Date().getMonth()+1;
            movimiento.MovimientoAño = new Date().getFullYear();
            movimiento.MovimientoConceptoId = req.body.PagoInfo.PagoConceptoId;
            movimiento.AbonadoId = req.body.PagoInfo.UserId;
            movimiento.MedioPagoId = req.body.MedioPagoId;
            //si requiere factura, instanciamos un nuevo objeto Factura
            if(req.body.RequiereFactura){
                let ultimaFacturaId = 0;
                //Buscamos la ultima Factura
                const ultimaFactura = await Factura.findOne({
                    order: [['FacturaId', 'DESC']]
                });
                if (ultimaFactura) ultimaFacturaId = ultimaFactura.FacturaId;
                const data  = {
                    'CantReg' 		: 1, // Cantidad de comprobantes a registrar
                    'PtoVta' 		: 3, // Punto de venta
                    'CbteTipo' 		: 6, // Tipo de comprobante (ver tipos disponibles). (6)Factura B
                    'Concepto' 		: 2, // Concepto del Comprobante: (1)Productos, (2)Servicios, (3)Productos y Servicios
                    'DocTipo' 		: 80, // Tipo de documento del comprador (ver tipos disponibles). (80)CUIT
                    'DocNro' 		: 20405245125, // Numero de documento del comprador
                    'CbteFch' 		: parseInt(date.replace(/-/g, '')), // (Opcional) Fecha del comprobante (yyyymmdd) o fecha actual si es nulo
                    'FchServDesde'  : parseInt(date.replace(/-/g, '')), // (Opcional) Fecha de inicio del servicio (yyyymmdd), obligatorio para Concepto 2 y 3
                    'FchServHasta'  : parseInt(date.replace(/-/g, '')), // (Opcional) Fecha de fin del servicio (yyyymmdd), obligatorio para Concepto 2 y 3
                    'FchVtoPago'    : parseInt(date.replace(/-/g, '')), // (Opcional) Fecha de vencimiento del servicio (yyyymmdd), obligatorio para Concepto 2 y 3
                    'ImpTotal' 		: req.body.PagoInfo.DetallePagoMonto, // Importe total del comprobante
                    'ImpTotConc' 	: req.body.PagoInfo.DetallePagoMonto, // Importe neto no gravado
                    'MonId' 		: 'PES', //Tipo de moneda usada en el comprobante (ver tipos disponibles)('PES' para pesos argentinos) 
                    'MonCotiz' 		: 1, // Cotización de la moneda usada (1 para pesos argentinos)  
                }
                const nuevoComprobante = await afip.ElectronicBilling.createNextVoucher(data, true);
                const factura = new Factura({transaction: t});
                factura.FacturaId = ultimaFacturaId + 1;
                factura.FacturaNumeroComprobante = nuevoComprobante.voucherNumber;
                factura.FacturaCodigoAutorizacion = nuevoComprobante.CAE;
                factura.FacturaFechaVencimientoCodigoAutorizacion = nuevoComprobante.CAEFchVto;
                factura.FacturaTipoCodigoAutorizacion = "E";
                factura.FacturaImporte = req.body.PagoInfo.DetallePagoMonto;
                factura.FacturaVersion = 1;
                factura.FacturaCuitEmisor = afip.CUIT;
                factura.FacturaPuntoVenta = 1;
                factura.FacturaFechaEmision = date;
                factura.FacturaTipoComprobante = 6;
                factura.FacturaMoneda = "PES";
                factura.FacturaCotizacion = 1;
                factura.FacturaTipoDocReceptor = 80;
                factura.FacturaNroDocReceptor = 20405245125;
                factura.FacturaAño = new Date().getFullYear();
                factura.FacturaMes = new Date().getMonth() + 1;
                factura.AbonadoId = req.body.PagoInfo.UserId;
                factura.createdAt = new Date();
                factura.createdBy = req.body.PagoInfo.createdBy;
                movimiento.FacturaId = factura.FacturaId;
                await factura.save({transaction: t});
            }
            //si encuentra el pago, NO se lo registra de nuevo, sino que solo se registra un nuevo detalle de pago y se actualiza el saldo
            if(pagoBuscar) {
                //verificamos que el monto ingresado no supere el saldo restante
                if(req.body.DetallePagoMonto > pagoBuscar.PagoSaldo) return res.status(400).json({msg: `El monto no puede ser mayor al saldo restante de: $ ${pagoBuscar.PagoSaldo}`})
                pagoBuscar.PagoSaldo = pagoBuscar.PagoSaldo - req.body.PagoInfo.DetallePagoMonto;
                pagoBuscar.updatedBy = req.body.PagoInfo.updatedBy;
                pagoBuscar.PagoObservaciones = req.body.PagoInfo.PagoObservaciones;
                const detallePago = new DetallePago(req.body, {transaction: t});
                detallePago.DetallePagoId = ultimoDetallePagoId + 1;
                detallePago.PagoId = req.body.PagoInfo.PagoId;
                detallePago.MedioPagoId = req.body.MedioPagoId;
                detallePago.DetallePagoMonto = req.body.PagoInfo.DetallePagoMonto;
                detallePago.createdAt = new Date();
                detallePago.createdBy = req.body.PagoInfo.createdBy;
                detallePago.MovimientoId = movimiento.MovimientoId;
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

exports.PagoAdelantadoCreate = async(req,res) => {
    const mesesAPagar = parseInt(req.body.PagoAdelantadoInfo.CantidadMesesAPagar)-1;
    const pagoAdelantadoObservaciones = `Pago Adelantado desde: ${req.body.MesesAPagar[0].PagoMes}/${req.body.MesesAPagar[0].PagoAño} hasta:${req.body.MesesAPagar[mesesAPagar].PagoMes}/${req.body.MesesAPagar[mesesAPagar].PagoAño}`
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
        await db.transaction(async(t)=>{
            const servicio = await Servicio.findByPk(req.body.PagoAdelantadoInfo.ServicioId, {transaction: t});
            let totalSinDescuento = req.body.MesesAPagar.map(item => item.PagoTotal).reduce((prev, curr) => prev + curr, 0);
            let total = totalSinDescuento;
            if(req.body.PagoAdelantadoInfo.CantidadMesesAPagar === 6){
                total = totalSinDescuento - (totalSinDescuento * servicio.ServicioBonificacionPagoSeisMeses/100);
            }
            if(req.body.PagoAdelantadoInfo.CantidadMesesAPagar === 12){
                total = totalSinDescuento - servicio.ServicioPrecioUnitario;
            }
            if(req.body.PagoAdelantadoInfo.CantidadMesesAPagar === 18){
                total = totalSinDescuento - 2* servicio.ServicioPrecioUnitario;
            }
            if(req.body.PagoAdelantadoInfo.CantidadMesesAPagar === 24){
                total = totalSinDescuento - 3* servicio.ServicioPrecioUnitario;
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
            //instanciamos un unico movimiento
            const movimiento = new Movimiento({transaction: t});
            movimiento.MovimientoId = ultimoMovimientoId + 1;
            movimiento.MunicipioId = req.body.PagoAdelantadoInfo.MunicipioId;
            movimiento.MovimientoCantidad = total;
            movimiento.createdAt = new Date();
            movimiento.createdBy = req.body.PagoAdelantadoInfo.createdBy;
            movimiento.MovimientoDia = new Date().getDate();
            movimiento.MovimientoMes = new Date().getMonth()+1;
            movimiento.MovimientoAño = new Date().getFullYear();
            movimiento.MovimientoConceptoId = 8; //Pago Adelantado
            movimiento.AbonadoId = req.body.PagoAdelantadoInfo.UserId;
            movimiento.MedioPagoId = req.body.PagoAdelantadoInfo.MedioPagoId;
            for(let i=0; i<=mesesAPagar; i++){
                const pago = await Pago.findByPk(req.body.MesesAPagar[i].PagoId, {transaction: t});
                pago.PagoSaldo = 0;
                pago.PagoObservaciones = pagoAdelantadoObservaciones;
                pago.updatedAt = new Date();
                pago.updatedBy = req.body.PagoAdelantadoInfo.updatedBy;
                await pago.save({transaction: t});
                const detallePago = new DetallePago({transaction: t});
                detallePago.DetallePagoId = ultimoDetallePagoId + 1;
                detallePago.PagoId = pago.PagoId;
                detallePago.MedioPagoId = req.body.PagoAdelantadoInfo.MedioPagoId;
                detallePago.DetallePagoMonto = pago.PagoTotal;
                detallePago.createdAt = new Date();
                detallePago.createdBy = req.body.PagoAdelantadoInfo.createdBy;
                detallePago.MovimientoId = movimiento.MovimientoId;
                ultimoDetallePagoId++;
                await detallePago.save({transaction: t});
            }
            await movimiento.save({transaction: t});
            return res.status(200).json({msg: 'El Pago Adelantado ha sido registrado correctamente'})
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
                'p.UserId': req.params.UserId
        });
        res.json(inscripcion);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error al encontrar los pagos del abonado'});
    }
}
