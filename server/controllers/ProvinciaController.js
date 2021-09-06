const db = require('./../config/connection');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
require('dotenv').config({path: 'variables.env'});

exports.ProvinciasListar = async(req, res) => {
    try {
        const provincias = await db.query('CALL _ProvinciaReadAll();');
        res.json(provincias);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al encontrar las provincias');
    }
}