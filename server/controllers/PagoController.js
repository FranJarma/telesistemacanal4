const db = require('./../config/connection');
const options =require('./../config/knex');
const knex = require('knex')(options);
const { validationResult } = require('express-validator');
const Pago = require('./../models/Pago');
const DetallePago = require('./../models/DetallePago');

require('dotenv').config({path: 'variables.env'});

exports.PagosListarPorUsuario = async(req,res) => {
    try {
        const pagos = await knex.select('*').from('pago as p')
        .where('p.UserId','=', req.params.id);
        res.json(pagos);
    } catch (error) {
        console.log(error);
    }
}
exports.PagoCreate = async(req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    if(req.body.DetallePagoMonto <= 0) return res.status(400).json({msg: 'El monto tiene que ser mayor a 0'});
    let periodo = req.body.PagoPeriodo.split('T')[0].split('-')[1] + '/' + req.body.PagoPeriodo.split('T')[0].split('-')[0];
    try {
        await db.transaction(async(t)=>{
            let ultimoDetallePagoId = 0;
            //buscamos si hay un pago registrado con ese UserId y esa fecha
            const pagoBuscar = await Pago.findOne({
                where: {
                    UserId: req.body.UserId,
                    PagoPeriodo: periodo
                }
            })
            //si encuentra el pago, NO se lo registra de nuevo, sino que solo se registra un nuevo detalle de pago y se actualiza el saldo
            if(pagoBuscar) {
                //Buscamos el último DetallePago del Pago encontrado y asignamos el ID
                const ultimoDetallePago = await DetallePago.findOne({
                    where: {
                        PagoId: pagoBuscar.PagoId
                    },
                    order: [['DetallePagoId', 'DESC']]
                });
                if (ultimoDetallePago) ultimoDetallePagoId = ultimoDetallePago.DetallePagoId;
                //verificamos que el monto ingresado no supere el saldo restante
                if(req.body.DetallePagoMonto >= pagoBuscar.PagoSaldo) return res.status(400).json({msg: `El monto no puede ser mayor al saldo restante de: $ ${pagoBuscar.PagoSaldo}`})
                pagoBuscar.PagoSaldo = pagoBuscar.PagoSaldo - req.body.DetallePagoMonto;
                const detallePago = new DetallePago(req.body, {transaction: t});
                detallePago.DetallePagoId = ultimoDetallePagoId + 1;
                detallePago.PagoId = pagoBuscar.PagoId;
                await pagoBuscar.save({transaction: t});
                await detallePago.save({transaction: t});
            }
            else {
            //si no encuentra el pago, se lo registra desde 0, con un nuevo detalle de pago
                let ultimoPagoId = 0;
                const ultimoPago = await Pago.findOne({
                //     order: [['PagoId', 'DESC']],
                });
                if (ultimoPago) ultimoPagoId = ultimoPago.PagoId;
                const pago = new Pago(req.body, {transaction: t});
                pago.PagoId = ultimoPagoId + 1;
                pago.PagoSaldo = req.body.PagoTotal - req.body.DetallePagoMonto;
                pago.PagoPeriodo = periodo;
                const detallePago = new DetallePago(req.body, {transaction: t});
                detallePago.DetallePagoId = 1;
                detallePago.PagoId = ultimoPagoId + 1;
                await pago.save({transaction: t});
                await detallePago.save({transaction: t});
            }
            return res.status(200).json({msg: 'El Pago ha sido registrado correctamente'})
        })
        }   
    catch (error) {
        console.log(error);
        res.status(400).json({msg: 'Hubo un error al registrar el pago'});
    }
}