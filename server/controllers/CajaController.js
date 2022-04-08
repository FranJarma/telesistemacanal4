const db = require('./../config/connection');
const options =require('./../config/knex');
const knex = require('knex')(options);
const Caja = require('../models/Caja');
const { validationResult } = require('express-validator');

exports.CajaGet = async (req, res) => {
    try {
        let caja = [];
        caja = await knex.select('c.CajaCerradaFecha',
        knex.raw('CONCAT(u.Nombre, ", ", u.Apellido) as CajaCerradaFullName'),
        knex.raw('CONCAT(u1.Nombre, ", ", u1.Apellido) as CajaRecibeFullName'))
        .from('caja as c')
        .innerJoin('_user as u', 'c.CajaCerradaUser', '=', 'u.UserId')
        .innerJoin('_user as u1', 'c.CajaRecibeUser', '=', 'u1.UserId')
        .where({
            'c.CajaAño': req.query.año,
            'c.CajaMes': req.query.mes,
            'c.CajaDia': req.query.dia,
            'c.CajaMunicipio': req.query.municipio,
            'c.CajaTurno': req.query.turno
        });
        res.json(caja);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al encontrar la caja del día seleccionado en ese municipio y ese turno');
    }
}

exports.CajaCerrar = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
        await db.transaction(async(t)=>{
            //buscamos la última caja
            let ultimaCajaId = 0;
            const ultimaCaja = await Caja.findOne({
                order: [['CajaId', 'DESC']]
            }); 
            if (ultimaCaja) ultimaCajaId = ultimaCaja.CajaId;
            let cajaTotal = req.body.CajaPesos;
            if(req.body.CajaCentavos != 00){
                cajaTotal = cajaTotal + '.' + parseInt(req.body.CajaCentavos);
            }
            const caja = new Caja(req.body, {transaction: t});
            caja.CajaId = ultimaCajaId + 1;
            caja.CajaCerradaFecha = new Date();
            caja.CajaRecibeUser = req.body.CajaRecibeUser.UserId;
            caja.CajaTotal = cajaTotal;
            caja.CajaDia = req.body.CajaDia;
            caja.CajaMes = req.body.CajaMes;
            caja.CajaAño = req.body.CajaAño;
            await caja.save({transaction: t});
            return res.status(200).json({msg: 'La Caja ha sido cerrada correctamente'})
        })
        }   
    catch (error) {
        console.log(error)
        res.status(400).json({msg: 'Hubo un error al cerrar la caja'});
    }
}

exports.CajaReAbrir = async (req, res) => {
    try {
        const caja = await Caja.findOne(req.params.CajaFecha);
        res.json(caja);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al encontrar la caja del día');
    }
}