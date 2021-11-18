const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const ServicioController = require('../controllers/ServicioController');
const ValidarJWT = require('../middlewares/ValidarJWT');

router.get('/', ValidarJWT, ServicioController.ServiciosListar);
router.post('/create', ValidarJWT, [
    check('ServicioNombre', 'El nombre del servicio es obligatorio').notEmpty(),
    check('ServicioPrecioUnitario', 'El precio unitario es obligatorio').notEmpty(),
], ServicioController.ServicioCreate);
router.put('/update', ValidarJWT, [
    check('ServicioNombre', 'El nombre del servicio es obligatorio').notEmpty(),
    check('ServicioPrecioUnitario', 'El precio unitario es obligatorio').notEmpty(),
], ServicioController.ServicioUpdate);
router.put('/delete', ValidarJWT, ServicioController.ServicioDelete);
module.exports = router;