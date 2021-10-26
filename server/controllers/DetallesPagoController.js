const options =require('./../config/knex');
const knex = require('knex')(options);

require('dotenv').config({path: 'variables.env'});

exports.DetallesPagoListar = async(req,res) => {
    try {
        const detallesPagos = await knex.select('*').from('detallepago as dp')
        .innerJoin('mediopago as mp','dp.MedioPagoId', '=', 'mp.MedioPagoId')
        .where('dp.PagoId','=', req.params.id)
        .orderBy('dp.DetallePagoFecha', 'desc');
        res.json(detallesPagos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error al encontrar los detalles del pago'});
    }
}