const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const ServicioController = require('../controllers/ServicioController');

router.get('/', ServicioController.ServiciosListar);
router.post('/create', [
    check('ServicioNombre', 'El nombre del servicio es obligatorio').notEmpty(),
    check('ServicioPrecioUnitario', 'El precio unitario es obligatorio').notEmpty(),
], ServicioController.ServicioCreate);
router.put('/update', [
    check('ServicioNombre', 'El nombre del servicio es obligatorio').notEmpty(),
    check('ServicioPrecioUnitario', 'El precio unitario es obligatorio').notEmpty(),
], ServicioController.ServicioUpdate);
router.put('/delete', ServicioController.ServicioDelete);
module.exports = router;