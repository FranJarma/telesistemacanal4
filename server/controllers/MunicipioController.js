const options =require('./../config/knex');
const knex = require('knex')(options);
require('dotenv').config({path: 'variables.env'});

exports.MunicipiosListarPorProvincia = async(req, res) => {
    try {
        const municipios = await knex.select('*').from('municipio as m')
        .join('provinciamunicipio as pm', 'm.MunicipioId', '=', 'pm.MunicipioId')
        .join('provincia as p', 'p.ProvinciaId', '=', 'pm.ProvinciaId')
        .where('p.ProvinciaId', '=', req.params.id);
        res.json(municipios);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al encontrar los municipios');
    }
}
