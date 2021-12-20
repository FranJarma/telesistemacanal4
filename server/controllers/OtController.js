const db = require('../config/connection');
const options =require('./../config/knex');
const knex = require('knex')(options);
const { validationResult } = require('express-validator');
const Ot = require('../models/Ot');
const Domicilio = require('./../models/Domicilio');
const UserDomicilio = require('./../models/UserDomicilio');
const User = require('./../models/User');
const OtTecnico = require('../models/OtTecnico');
const OtTarea = require('../models/OtTarea');

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

            let ultimaOtRegistradaId = 0;
            let ultimoOtTecnicoRegistradoId = 0;
            let ultimaOtTareaRegistradaId = 0;

            //Buscamos la ultima OT registrada
            let ultimaOtRegistrada = await Ot.findOne({
                order: [['OtId', 'DESC']]
            });
            if(ultimaOtRegistrada) ultimaOtRegistradaId = ultimaOtRegistrada.OtId;

            //Buscamos el ultimo OTTecnico registrado
            let ultimoOtTecnicoRegistrado = await OtTecnico.findOne({
                order: [['OtTecnicoId', 'DESC']]
            });
            if(ultimoOtTecnicoRegistrado) ultimoOtTecnicoRegistradoId = ultimoOtTecnicoRegistradoId.OtTecnicoId;

            //Buscamos la ultima OTTarea registrada
            let ultimaOtTareaRegistrada = await OtTarea.findOne({
                order: [['OtTareaId', 'DESC']]
            });
            if(ultimaOtTareaRegistrada) ultimaOtTareaRegistradaId = ultimaOtTareaRegistradaId.OtTareaId;
            //verificar que no existe una OT registrada para ese día, ese abonado y esas tareas seleccionadas
            const ot = new Ot(req.body);
            ot.OtId = ultimaOtRegistradaId + 1;
            ot.OtAbonadoId = req.body.abonado.UserId;
            ot.OtEstadoId = process.env.ESTADO_ID_OT_REGISTRADA; //registrada
            await ot.save({transaction: t});

            for (let i=0; i<= req.body.tecnicos.length-1; i++){
                let obj = {
                    OtTecnicoId: ultimoOtTecnicoRegistradoId + 1,
                    TecnicoId: req.body.tecnicos[i].UserId,
                    OtId: ot.OtId,
                    createdBy: req.body.createdBy
                }
                const otTecnico = new OtTecnico(obj);
                ultimoOtTecnicoRegistradoId = ultimoOtTecnicoRegistradoId + 1;
                await otTecnico.save({transaction: t});
            }
            
            for (let i=0; i<= req.body.tareasOt.length-1; i++){
                let obj = {
                    OtTareaId: ultimaOtTareaRegistradaId + 1,
                    TareaId: req.body.tareasOt[i].TareaId,
                    OtId: ot.OtId,
                    createdBy: req.body.createdBy
                }
                const otTarea = new OtTarea(obj);
                ultimaOtTareaRegistradaId = ultimaOtTareaRegistradaId + 1;
                await otTarea.save({transaction: t});
            }
            //si la tarea seleccionada es Cambio Domicilio (de cualquier tipo), instanciamos un objeto de la clase CambioDomicilio
            if(req.body.tareasOt.find((tareasOt => tareasOt.TareaId === 14 || tareasOt.TareaId === 15 ))){
                //traemos el id del ultimo domicilio registrado
                let ultimoDomicilioId = 0;
                const ultimoDomicilio = await Domicilio.findOne({
                    order: [['DomicilioId', 'DESC']],
                });
                if (ultimoDomicilio) ultimoDomicilioId = ultimoDomicilio.DomicilioId;
                const domicilio = new Domicilio(req.body, {transaction: t});
                domicilio.DomicilioId = ultimoDomicilioId + 1;
                domicilio.BarrioId = req.body.barrio.BarrioId;
                //buscamos el user para actualizarle el estado, el domicilio se lo actualiza cuando se confirme la instalación
                const abonado = await User.findByPk( req.body.abonado.UserId, {transaction: t} );
                let ultimoUserDomicilio = await UserDomicilio.findOne({
                    order: [["UserDomicilioId", "DESC"]]
                })
                const abonadoDomicilio = new UserDomicilio(req.body, {transaction: t});
                abonadoDomicilio.UserDomicilioId = ultimoUserDomicilio.UserDomicilioId + 1;
                abonadoDomicilio.DomicilioId = ultimoDomicilioId + 1;
                await domicilio.save({transaction: t}),
                await abonado.save({transaction: t});
                await abonadoDomicilio.save({transaction: t});
            }
            //si la tarea seleccionada es algo relacionado a cambio de servicio, instanciamos un objeto de la clase CambioServicio  
            if(req.body.tareasOt.find((tareasOt => tareasOt.TareaId === 4 ))){
                let ultimoUserServicio = await UserServicio.findOne({
                    order: [["UserServicioId", "DESC"]]
                })
                const abonadoServicio = new UserServicio(req.body, {transaction: t});
                abonadoServicio.UserServicioId = ultimoUserServicio.UserServicioId + 1;
                abonadoServicio.ServicioId = process.env.ESTADO_ID_SERVICIO_INTERNET;
                abonado.ServicioId = process.env.ESTADO_ID_SERVICIO_INTERNET; //cambia a INTERNET
                await abonado.save({transaction: t});
                await abonadoServicio.save({transaction: t});
            }
        })
        return res.status(200).send({ msg: 'La Orden de Trabajo ha sido registrada correctamente'});
    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: 'Hubo un error al registrar la orden de trabajo'});
    }
}