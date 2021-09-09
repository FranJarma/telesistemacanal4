const db = require('../config/connection');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
require('dotenv').config({path: 'variables.env'});

exports.CondicionesIVAListar = async(req, res) => {
    try {
        const condicionesIVA = await db.query(`CALL _CondicionesIVAReadAll();`);
        res.json(condicionesIVA);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al encontrar las condiciones IVA');
    }
}