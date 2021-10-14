const db = require('./../config/connection');
const { validationResult } = require('express-validator');
require('dotenv').config({path: 'variables.env'});

exports.PagoCreate = async(req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    if(req.body.DetallePagoMonto < 0) return res.status(400).json({msg: 'El monto tiene que ser mayor a 0'});
    if(req.body.DetallePagoMonto > req.body.PagoTotal) return res.status(400).json({msg: 'El monto no puede superar al total'});
    try {
        await db.transaction(async(t)=>{
            console.log(req.body);
        //traemos el id del ultimo domicilio registrado y de la ultima onu registrada
            return res.status(200).json({msg: 'El Pago ha sido registrado correctamente'})
        })
        }   
    catch (error) {
        res.status(400).json({msg: 'Hubo un error al registrar el abonado'});
    }
}