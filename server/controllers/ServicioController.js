const db = require('./../config/connection');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
require('dotenv').config({path: 'variables.env'});

exports.ServiciosListar = async(req, res) => {
    try {
        const servicios = await db.query(`CALL _ServiciosReadAll();`);
        res.json(servicios);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al encontrar los servicios');
    }
}