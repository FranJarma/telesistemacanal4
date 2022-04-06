const db = require('./../config/connection');
const options =require('./../config/knex');
const knex = require('knex')(options);
const { validationResult } = require('express-validator');
const Movimiento = require('../models/Movimiento');
const MovimientoConcepto = require('../models/MovimientoConcepto');

exports.MovimientosGetByFecha = async (req, res) => {
    const timestamp = req.query.Año+'-'+req.query.Mes+'-'+req.query.Dia;
    let movimientos = "";
    try {
        //SELECCIONADO TODOS LOS MUNICIPIOS Y TODO EL DIA
        if(req.query.Municipio == 0 && req.query.Turno === 'Todos'){
            movimientos = await knex.
            select('m.MovimientoId', 'm.MunicipioId', 'm.MovimientoCantidad', 'm.MovimientoDia',
            'm.MovimientoMes', 'm.MovimientoAño', 'm.createdAt', 'u.Nombre as NombreCarga',
            'u.Apellido as ApellidoCarga','u1.Nombre as NombreAbonado',
            'u1.Apellido as ApellidoAbonado', 'mc.MovimientoConceptoNombre as Concepto',
            'mc.MovimientoConceptoTipo as Tipo', 'mp.MedioPagoNombre')
            .from('movimiento as m')
            .innerJoin('_user as u','u.UserId','=','m.createdBy')
            .leftJoin('_user as u1','u1.UserId','=','m.abonadoId')
            .innerJoin('movimientoconcepto as mc', 'm.MovimientoConceptoId','=','mc.MovimientoConceptoId')
            .innerJoin('mediopago as mp', 'mp.MedioPagoId', '=', 'm.MedioPagoId')
            .where({
                'm.MovimientoDia': req.query.Dia,
                'm.MovimientoMes': req.query.Mes,
                'm.MovimientoAño': req.query.Año
            })
            .andWhere('m.createdAt', '<=', timestamp + "T22:00:00")
            .andWhere('m.createdAt', '>=', timestamp + "T8:00:00")
        }
        //SELECCIONADO TODOS LOS MUNICIPIOS Y TURNO MAÑANA
        if(req.query.Municipio == 0 && req.query.Turno === 'Mañana'){
            movimientos = await knex.
            select('m.MovimientoId', 'm.MunicipioId', 'm.MovimientoCantidad', 'm.MovimientoDia',
            'm.MovimientoMes', 'm.MovimientoAño', 'm.createdAt', 'u.Nombre as NombreCarga',
            'u.Apellido as ApellidoCarga','u1.Nombre as NombreAbonado',
            'u1.Apellido as ApellidoAbonado', 'mc.MovimientoConceptoNombre as Concepto',
            'mc.MovimientoConceptoTipo as Tipo', 'mp.MedioPagoNombre')
            .from('movimiento as m')
            .innerJoin('_user as u','u.UserId','=','m.createdBy')
            .leftJoin('_user as u1','u1.UserId','=','m.abonadoId')
            .innerJoin('movimientoconcepto as mc', 'm.MovimientoConceptoId','=','mc.MovimientoConceptoId')
            .innerJoin('mediopago as mp', 'mp.MedioPagoId', '=', 'm.MedioPagoId')
            .where({
                'm.MovimientoDia': req.query.Dia,
                'm.MovimientoMes': req.query.Mes,
                'm.MovimientoAño': req.query.Año
            })
            .andWhere('m.createdAt', '<=', timestamp + "T12:00:00")
            .andWhere('m.createdAt', '>=', timestamp + "T8:00:00")
        }
        //SELECCIONADO TODOS LOS MUNICIPIOS Y TURNO TARDE
        if(req.query.Municipio == 0 && req.query.Turno === 'Tarde'){
            movimientos = await knex.
            select('m.MovimientoId', 'm.MunicipioId', 'm.MovimientoCantidad', 'm.MovimientoDia',
            'm.MovimientoMes', 'm.MovimientoAño', 'm.createdAt', 'u.Nombre as NombreCarga',
            'u.Apellido as ApellidoCarga','u1.Nombre as NombreAbonado',
            'u1.Apellido as ApellidoAbonado', 'mc.MovimientoConceptoNombre as Concepto',
            'mc.MovimientoConceptoTipo as Tipo', 'mp.MedioPagoNombre')
            .from('movimiento as m')
            .innerJoin('_user as u','u.UserId','=','m.createdBy')
            .leftJoin('_user as u1','u1.UserId','=','m.abonadoId')
            .innerJoin('movimientoconcepto as mc', 'm.MovimientoConceptoId','=','mc.MovimientoConceptoId')
            .innerJoin('mediopago as mp', 'mp.MedioPagoId', '=', 'm.MedioPagoId')
            .where({
                'm.MovimientoDia': req.query.Dia,
                'm.MovimientoMes': req.query.Mes,
                'm.MovimientoAño': req.query.Año
            })
            .andWhere('m.createdAt', '<=', timestamp + "T22:00:00")
            .andWhere('m.createdAt', '>=', timestamp + "T16:00:00")
        }
        //SELECCIONADO ALGUN MUNICIPIO Y TODO EL DIA
        if(req.query.Municipio != 0 && req.query.Turno === 'Todos'){
            movimientos = await knex.
            select('m.MovimientoId', 'm.MunicipioId', 'm.MovimientoCantidad', 'm.MovimientoDia',
            'm.MovimientoMes', 'm.MovimientoAño', 'm.createdAt', 'u.Nombre as NombreCarga',
            'u.Apellido as ApellidoCarga','u1.Nombre as NombreAbonado',
            'u1.Apellido as ApellidoAbonado', 'mc.MovimientoConceptoNombre as Concepto',
            'mc.MovimientoConceptoTipo as Tipo', 'mp.MedioPagoNombre')
            .from('movimiento as m')
            .innerJoin('_user as u','u.UserId','=','m.createdBy')
            .leftJoin('_user as u1','u1.UserId','=','m.abonadoId')
            .innerJoin('movimientoconcepto as mc', 'm.MovimientoConceptoId','=','mc.MovimientoConceptoId')
            .innerJoin('mediopago as mp', 'mp.MedioPagoId', '=', 'm.MedioPagoId')
            .where({
                'm.MovimientoDia': req.query.Dia,
                'm.MovimientoMes': req.query.Mes,
                'm.MovimientoAño': req.query.Año,
                'm.MunicipioId': req.query.Municipio
            })
            .andWhere('m.createdAt', '<=', timestamp + "T22:00:00")
            .andWhere('m.createdAt', '>=', timestamp + "T8:00:00")
        }
        //SELECCIONADO ALGUN MUNICIPIO Y TURNO MAÑANA
        if(req.query.Municipio != 0 && req.query.Turno === 'Mañana'){
            movimientos = await knex.
            select('m.MovimientoId', 'm.MunicipioId', 'm.MovimientoCantidad', 'm.MovimientoDia',
            'm.MovimientoMes', 'm.MovimientoAño', 'm.createdAt', 'u.Nombre as NombreCarga',
            'u.Apellido as ApellidoCarga','u1.Nombre as NombreAbonado',
            'u1.Apellido as ApellidoAbonado', 'mc.MovimientoConceptoNombre as Concepto',
            'mc.MovimientoConceptoTipo as Tipo', 'mp.MedioPagoNombre')
            .from('movimiento as m')
            .innerJoin('_user as u','u.UserId','=','m.createdBy')
            .leftJoin('_user as u1','u1.UserId','=','m.abonadoId')
            .innerJoin('movimientoconcepto as mc', 'm.MovimientoConceptoId','=','mc.MovimientoConceptoId')
            .innerJoin('mediopago as mp', 'mp.MedioPagoId', '=', 'm.MedioPagoId')
            .where({
                'm.MovimientoDia': req.query.Dia,
                'm.MovimientoMes': req.query.Mes,
                'm.MovimientoAño': req.query.Año,
                'm.MunicipioId': req.query.Municipio
            })
            .andWhere('m.createdAt', '<=', timestamp + "T12:00:00")
            .andWhere('m.createdAt', '>=', timestamp + "T8:00:00")
        }
        //SELECCIONADO ALGUN MUNICIPIO Y TURNO TARDE
        if(req.query.Municipio != 0 && req.query.Turno === 'Tarde'){
            movimientos = await knex.
            select('m.MovimientoId', 'm.MunicipioId', 'm.MovimientoCantidad', 'm.MovimientoDia',
            'm.MovimientoMes', 'm.MovimientoAño', 'm.createdAt', 'u.Nombre as NombreCarga',
            'u.Apellido as ApellidoCarga','u1.Nombre as NombreAbonado',
            'u1.Apellido as ApellidoAbonado', 'mc.MovimientoConceptoNombre as Concepto',
            'mc.MovimientoConceptoTipo as Tipo', 'mp.MedioPagoNombre')
            .from('movimiento as m')
            .innerJoin('_user as u','u.UserId','=','m.createdBy')
            .leftJoin('_user as u1','u1.UserId','=','m.abonadoId')
            .innerJoin('movimientoconcepto as mc', 'm.MovimientoConceptoId','=','mc.MovimientoConceptoId')
            .innerJoin('mediopago as mp', 'mp.MedioPagoId', '=', 'm.MedioPagoId')
            .where({
                'm.MovimientoDia': req.query.Dia,
                'm.MovimientoMes': req.query.Mes,
                'm.MovimientoAño': req.query.Año,
                'm.MunicipioId': req.query.Municipio
            })
            .andWhere('m.createdAt', '<=', timestamp + "T22:00:00")
            .andWhere('m.createdAt', '>=', timestamp + "T16:00:00")
        }
        res.json(movimientos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error al encontrar los movimientos del día'});
    }
}

exports.MovimientoCreate = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
        let movimientoCantidad = req.body.MovimientoCantidad.MovimientoPesos;
        if(req.body.MovimientoCantidad.MovimientoCentavos != 00){
            movimientoCantidad = movimientoCantidad + '.' + parseInt(req.body.MovimientoCantidad.MovimientoCentavos);
        }
        await db.transaction(async(t)=>{
            const ultimoMovimiento = await Movimiento.findOne({
                order: [['MovimientoId', 'DESC']]
            });
            let ultimoMovimientoId = ultimoMovimiento.MovimientoId + 1;
            const movimiento = new Movimiento(req.body);
            movimiento.MovimientoId = ultimoMovimientoId;
            movimiento.MovimientoDia = new Date().getDate();
            movimiento.MovimientoMes = new Date().getMonth()+1;
            movimiento.MovimientoAño = new Date().getFullYear();
            movimiento.MunicipioId = req.body.Municipio;
            movimiento.MovimientoConceptoId = req.body.MovimientoConcepto.MovimientoConceptoId;
            movimiento.MedioPagoId = req.body.MedioPagoId;
            movimiento.createdAt = new Date();
            movimiento.createdBy = req.body.createdBy;
            if(req.body.MovimientoConcepto.MovimientoConceptoTipo === 'Gasto') {
                movimiento.MovimientoCantidad = (-1) * movimientoCantidad;
            }
            await movimiento.save({transaction: t});
            return res.status(200).json({msg: 'El Movimiento ha sido registrado correctamente'})
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({msg: 'Hubo un error al registrar el movimiento'});
    }
}