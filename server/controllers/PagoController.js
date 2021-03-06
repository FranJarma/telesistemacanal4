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
const Recibo = require('../models/Recibo');
const Domicilio = require('../models/Domicilio');
const Barrio = require('../models/Barrio');
const Municipio = require('../models/Municipio');
const MovimientoConcepto = require('../models/MovimientoConcepto');
const { Op, literal } = require('sequelize');

const date = new Date(Date.now() - ((new Date()).getTimezoneOffset() * 60000)).toISOString().split('T')[0];
const afip = new Afip({ CUIT: 30687336506, cert: "tls_pem.pem", key: "tls_key.key", res_folder: './', production: 'false' });

require('dotenv').config({path: 'variables.env'});

exports.PagosListarPorUsuario = async(req,res) => {
    try {
        const pagos = await knex.select('*').from('pago as p')
        .innerJoin('movimientoconcepto as mc', 'p.PagoConceptoId', '=', 'mc.MovimientoConceptoId')
        .where(
            {'p.UserId': req.query.UserId,
            'p.PagoAño': req.query.Periodo,
            'p.PagoConceptoId': req.query.Concepto,
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
            const abonado = await User.findOne({
                where: {
                    UserId: req.body.PagoInfo.UserId
                }
            })
            const domicilioAbonado = await Domicilio.findOne({
                where: {
                    DomicilioId: abonado.DomicilioId
                }
            })
            const barrioAbonado = await Barrio.findOne({
                where: {
                    BarrioId: domicilioAbonado.BarrioId
                }
            })
            const municipioAbonado = await Municipio.findOne({
                where: {
                    MunicipioId: barrioAbonado.MunicipioId
                }
            })
            const movimientoConceptoNombre = await MovimientoConcepto.findOne({
                where: {
                    MovimientoConceptoId: movimiento.MovimientoConceptoId
                }
            })
            let factura = null;
            let recibo = null;
            let datosFactura = null;
            let datosRecibo = null;
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
                factura = new Factura({transaction: t});
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
                datosFactura = {FacturaId: factura.FacturaId, FacturaNumeroComprobante: factura.FacturaNumeroComprobante,
                    FacturaCodigoAutorizacion: factura.FacturaCodigoAutorizacion, FacturaFechaVencimientoCodigoAutorizacion: factura.FacturaFechaVencimientoCodigoAutorizacion,
                    FacturaTipoCodigoAutorizacion: factura.FacturaTipoCodigoAutorizacion, FacturaImporte: factura.FacturaImporte,
                    FacturaVersion: factura.FacturaVersion, FacturaCuitEmisor: factura.FacturaCuitEmisor, FacturaPuntoVenta: factura.FacturaPuntoVenta,
                    FacturaFechaEmision: factura.FacturaFechaEmision, FacturaTipoComprobante: factura.FacturaTipoComprobante,
                    FacturaMoneda: factura.FacturaMoneda, FacturaCotizacion: factura.FacturaCotizacion, FacturaTipoDocReceptor: factura.FacturaTipoDocReceptor,
                    FacturaNroDocReceptor: factura.FacturaNroDocReceptor, FacturaAño: factura.FacturaAño, FacturaMes: factura.FacturaMes,
                    AbonadoId: factura.AbonadoId, createdAt: factura.createdAt, createdBy: factura.createdBy,
                    ApellidoAbonado: abonado.Apellido, NombreAbonado: abonado.Nombre,
                    DomicilioCalle: domicilioAbonado.DomicilioCalle, DomicilioNumero: domicilioAbonado.DomicilioNumero,
                    BarrioNombre: barrioAbonado.BarrioNombre, MunicipioNombre: municipioAbonado.MunicipioNombre,
                    MovimientoConceptoId: movimiento.MovimientoConceptoId, MovimientoConceptoNombre: movimientoConceptoNombre.MovimientoConceptoNombre, MovimientoCantidad: movimiento.MovimientoCantidad    
                }
                await factura.save({transaction: t});
            }
            else {
                let ultimoReciboId = 0;
                //Buscamos el ultimo Recibo
                const ultimoRecibo = await Recibo.findOne({
                    order: [['ReciboId', 'DESC']]
                });
                if (ultimoRecibo) ultimoReciboId = ultimoRecibo.ReciboId;
                recibo = new Recibo({transaction: t});
                recibo.ReciboId = ultimoReciboId + 1;
                recibo.ReciboImporte = req.body.PagoInfo.DetallePagoMonto;
                recibo.createdAt = new Date();
                recibo.createdBy = req.body.PagoInfo.createdBy;
                await recibo.save({transaction: t});
                movimiento.ReciboId = recibo.ReciboId;
                datosRecibo = {ReciboId: recibo.ReciboId, createdAt: recibo.createdAt,
                    ApellidoAbonado: abonado.Apellido, NombreAbonado: abonado.Nombre, Cuit: abonado.Cuit, AbonadoNumero: abonado.AbonadoNumero,
                    DomicilioCalle: domicilioAbonado.DomicilioCalle, DomicilioNumero: domicilioAbonado.DomicilioNumero,
                    BarrioNombre: barrioAbonado.BarrioNombre, MunicipioNombre: municipioAbonado.MunicipioNombre,
                    MovimientoConceptoId: movimiento.MovimientoConceptoId, MovimientoConceptoNombre: movimientoConceptoNombre.MovimientoConceptoNombre, MovimientoCantidad: movimiento.MovimientoCantidad    
                }
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
            return res.status(200).json({msg: 'El Pago ha sido registrado correctamente', factura: datosFactura, recibo: datosRecibo})
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
            const abonado = await User.findByPk(req.body.PagoAdelantadoInfo.UserId, {transaction: t});
            const domicilio = await Domicilio.findByPk(abonado.DomicilioId, {transaction: t});
            const barrio = await Barrio.findByPk(domicilio.BarrioId, {transaction: t});
            const municipio = await Municipio.findByPk(barrio.MunicipioId, {transaction: t});
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
            movimiento.MunicipioId = municipio.MunicipioId;
            movimiento.MovimientoCantidad = total;
            movimiento.createdAt = new Date();
            movimiento.createdBy = req.body.PagoAdelantadoInfo.createdBy;
            movimiento.MovimientoDia = new Date().getDate();
            movimiento.MovimientoMes = new Date().getMonth()+1;
            movimiento.MovimientoAño = new Date().getFullYear();
            movimiento.MovimientoConceptoId = 1;
            movimiento.AbonadoId = abonado.UserId;
            movimiento.MedioPagoId = req.body.PagoAdelantadoInfo.MedioPagoId;
            for(let i=0; i<=mesesAPagar; i++){
                const pago = await Pago.findByPk(req.body.MesesAPagar[i].PagoId, {transaction: t});
                pago.PagoSaldo = 0;
                pago.PagoConceptoId = 1;
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
            let factura = null;
            let datosFactura = null;
            let datosRecibo = null;
            let recibo = null;
            const movimientoConceptoNombre = await MovimientoConcepto.findOne({
                where: {
                    MovimientoConceptoId: movimiento.MovimientoConceptoId
                }
            })
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
                    'ImpTotal' 		: total, // Importe total del comprobante
                    'ImpTotConc' 	: total, // Importe neto no gravado
                    'MonId' 		: 'PES', //Tipo de moneda usada en el comprobante (ver tipos disponibles)('PES' para pesos argentinos) 
                    'MonCotiz' 		: 1, // Cotización de la moneda usada (1 para pesos argentinos)  
                }
                const nuevoComprobante = await afip.ElectronicBilling.createNextVoucher(data, true);
                factura = new Factura({transaction: t});
                factura.FacturaId = ultimaFacturaId + 1;
                factura.FacturaNumeroComprobante = nuevoComprobante.voucherNumber;
                factura.FacturaCodigoAutorizacion = nuevoComprobante.CAE;
                factura.FacturaFechaVencimientoCodigoAutorizacion = nuevoComprobante.CAEFchVto;
                factura.FacturaTipoCodigoAutorizacion = "E";
                factura.FacturaImporte = total;
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
                factura.AbonadoId = abonado.UserId;
                factura.createdAt = new Date();
                factura.createdBy = req.body.createdBy;
                movimiento.FacturaId = factura.FacturaId;
                await factura.save({transaction: t});
                datosFactura = {FacturaId: factura.FacturaId, FacturaNumeroComprobante: factura.FacturaNumeroComprobante,
                    FacturaCodigoAutorizacion: factura.FacturaCodigoAutorizacion, FacturaFechaVencimientoCodigoAutorizacion: factura.FacturaFechaVencimientoCodigoAutorizacion,
                    FacturaTipoCodigoAutorizacion: factura.FacturaTipoCodigoAutorizacion, FacturaImporte: factura.FacturaImporte,
                    FacturaVersion: factura.FacturaVersion, FacturaCuitEmisor: factura.FacturaCuitEmisor, FacturaPuntoVenta: factura.FacturaPuntoVenta,
                    FacturaFechaEmision: factura.FacturaFechaEmision, FacturaTipoComprobante: factura.FacturaTipoComprobante,
                    FacturaMoneda: factura.FacturaMoneda, FacturaCotizacion: factura.FacturaCotizacion, FacturaTipoDocReceptor: factura.FacturaTipoDocReceptor,
                    FacturaNroDocReceptor: factura.FacturaNroDocReceptor, FacturaAño: factura.FacturaAño, FacturaMes: factura.FacturaMes,
                    AbonadoId: factura.AbonadoId, createdAt: factura.createdAt, createdBy: factura.createdBy,
                    ApellidoAbonado: abonado.Apellido, NombreAbonado: abonado.Nombre,
                    DomicilioCalle: domicilio.DomicilioCalle, DomicilioNumero: domicilio.DomicilioNumero,
                    BarrioNombre: barrio.BarrioNombre, MunicipioNombre: municipio.MunicipioNombre,
                    MovimientoConceptoId: movimiento.MovimientoConceptoId, MovimientoConceptoNombre: movimientoConceptoNombre.MovimientoConceptoNombre, MovimientoCantidad: movimiento.MovimientoCantidad    
                }
            }
            else {
                let ultimoReciboId = 0;
                //Buscamos el ultimo Recibo
                const ultimoRecibo = await Recibo.findOne({
                    order: [['ReciboId', 'DESC']]
                });
                if (ultimoRecibo) ultimoReciboId = ultimoRecibo.ReciboId;
                recibo = new Recibo({transaction: t});
                recibo.ReciboId = ultimoReciboId + 1;
                recibo.ReciboImporte = req.body.PagoAdelantadoInfo.DetallePagoMonto;
                recibo.createdAt = new Date();
                recibo.createdBy = req.body.PagoAdelantadoInfo.createdBy;
                await recibo.save({transaction: t});
                movimiento.ReciboId = recibo.ReciboId;
                datosRecibo = {ReciboId: recibo.ReciboId, createdAt: recibo.createdAt,
                    ApellidoAbonado: abonado.Apellido, NombreAbonado: abonado.Nombre, Cuit: abonado.Cuit, AbonadoNumero: abonado.AbonadoNumero,
                    DomicilioCalle: domicilio.DomicilioCalle, DomicilioNumero: domicilio.DomicilioNumero,
                    BarrioNombre: barrio.BarrioNombre, MunicipioNombre: municipio.MunicipioNombre,
                    MovimientoConceptoId: movimiento.MovimientoConceptoId, MovimientoConceptoNombre: movimientoConceptoNombre.MovimientoConceptoNombre, MovimientoCantidad: movimiento.MovimientoCantidad,
                    mesesAPagar: req.body.MesesAPagar
                }
            }
            await movimiento.save({transaction: t});
            return res.status(200).json({msg: 'El Pago Adelantado ha sido registrado correctamente', factura: datosFactura, recibo: datosRecibo})
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

exports.PagosAñadirRecargosAutomaticos = async (req, res) => {
    try {
        const mesActual = new Date().getMonth() + 1;
        const añoActual = new Date().getFullYear();
        await db.transaction(async (t)=> {
            await Pago.update(
                {
                    PagoSaldo: literal('PagoSaldo + 50'),
                    PagoRecargo: literal('PagoRecargo + 50'),
                    PagoObservaciones: `Recargo agregado automáticamente el día: ${new Date().toLocaleDateString()}`,
                    updatedAt: new Date(),
                    updatedBy: 'DA200A5B-360D-4402-B07D-24ED19D1DB14'
                },
                {
                    where: {
                        PagoSaldo: {
                            [Op.gt]: 0
                        },
                        PagoAño: {
                            [Op.lte]: añoActual
                        },
                        PagoMes: {
                            [Op.lte]: mesActual
                        },
                        PagoConceptoId: 1
                    }
                },
            {transaction: t});
        })
    } catch (error) {
        console.log('Error:', error)
    }
}