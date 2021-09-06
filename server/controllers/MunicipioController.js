const db = require('./../config/connection');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
require('dotenv').config({path: 'variables.env'});

exports.MunicipiosListarPorProvincia = async(req, res) => {
    try {
        const municipios = await db.query(`CALL _MunicipioReadAllByProvincia(${req.params.id});`);
        res.json(municipios);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al encontrar los municipios');
    }
}