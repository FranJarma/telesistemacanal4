const express = require('express');
const router = express.Router();
const MovimientoController = require('../controllers/MovimientoController');
const { check } = require('express-validator');
const ValidarJWT = require('../middlewares/ValidarJWT');

router.get('/Dia=:Dia&Mes=:Mes&Anio=:Anio', ValidarJWT, MovimientoController.MovimientosGetByFecha);

module.exports = router;