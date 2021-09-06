const db = require('./../config/connection');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
require('dotenv').config({path: 'variables.env'});

exports.BarriosListarPorMunicipio = async(req, res) => {
    try {
        const barrios = await db.query(`CALL _BarrioReadAllByMunicipio(${req.params.id});`);
        res.json(barrios);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al encontrar los barrios');
    }
}