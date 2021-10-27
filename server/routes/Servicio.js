const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const ServicioController = require('../controllers/ServicioController');

router.get('/', ServicioController.ServiciosListar);
router.post('/create', [
    check('ServicioNombre', 'El nombre del servicio es obligatorio').notEmpty(),
    check('ServicioPrecioUnitario', 'El precio unitario es obligatorio').notEmpty(),
], ServicioController.ServicioCreate);
module.exports = router;