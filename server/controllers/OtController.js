const db = require('../config/connection');
const options =require('./../config/knex');
const knex = require('knex')(options);
const { validationResult } = require('express-validator');
const Ot = require('../models/Ot');
const Domicilio = require('./../models/Domicilio');
const UserDomicilio = require('./../models/UserDomicilio');
const User = require('./../models/User');

require('dotenv').config({path: 'variables.env'});

exports.OtGet = async(req, res) => {
    try {
        const ot = await knex.select('*').from('ot as ot')
        .where({'ot.deletedAt': null});
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
            //Buscamos la ultima OT registrada
            let ultimaOtRegistradaId = 0;
            let ultimaOtRegistrada = await Ot.findOne({
                order: [['OtId', 'DESC']]
            });
            if(ultimaOtRegistrada) ultimaOtRegistradaId = ultimaOtRegistrada.OtId;
            //verificar que no existe una OT registrada para ese día, ese abonado y esas tareas seleccionadas
            const ot = new Ot(req.body);
            ot.OtId = ultimaOtRegistradaId + 1;
            ot.OtAbonadoId = req.body.abonado.UserId;
            ot.OtEstadoId = 5; //registrada
            console.log(ot);
            //si la tarea seleccionada es Cambio Domicilio (de cualquier tipo), instanciamos un objeto de la clase CambioDomicilio
            // if(req.body.tareasOt.find((tareasOt => tareasOt.TareaId === 14 || tareasOt.TareaId === 15 ))){
            //     //traemos el id del ultimo domicilio registrado
            //     let ultimoDomicilioId = 0;
            //     const ultimoDomicilio = await Domicilio.findOne({
            //         order: [['DomicilioId', 'DESC']],
            //     });
            //     if (ultimoDomicilio) ultimoDomicilioId = ultimoDomicilio.DomicilioId;
            //     const domicilio = new Domicilio(req.body, {transaction: t});
            //     domicilio.DomicilioId = ultimoDomicilioId + 1;
            //     domicilio.BarrioId = req.body.barrio.BarrioId;
            //     //buscamos el user para actualizarle el estado, el domicilio se lo actualiza cuando se confirme la instalación
            //     const abonado = await User.findByPk( req.body.abonado.UserId, {transaction: t} );
            //     abonado.EstadoId = 7; //Esperando cambio de domicilio...
            //     let ultimoUserDomicilio = await UserDomicilio.findOne({
            //         order: [["UserDomicilioId", "DESC"]]
            //     })
            //     const abonadoDomicilio = new UserDomicilio(req.body, {transaction: t});
            //     abonadoDomicilio.UserDomicilioId = ultimoUserDomicilio.UserDomicilioId + 1;
            //     abonadoDomicilio.DomicilioId = ultimoDomicilioId + 1;
            //     // await domicilio.save({transaction: t}),
            //     // await abonado.save({transaction: t});
            //     // await abonadoDomicilio.save({transaction: t});
            // }
            //si la tarea seleccionada es algo relacionado a cambio de servicio, instanciamos un objeto de la clase CambioServicio
        })
        return res.status(200).send({ msg: 'La Orden de Trabajo ha sido registrada correctamente'});
    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: 'Hubo un error al registrar la orden de trabajo'});
    }
}