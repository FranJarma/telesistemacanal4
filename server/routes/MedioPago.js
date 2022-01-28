const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const MedioPagoController = require('../controllers/MedioPagoController');
const ValidarJWT = require('../middlewares/ValidarJWT');

router.get('/', ValidarJWT, MedioPagoController.MediosDePagoListar);
router.post('/create', ValidarJWT, [
    check('MedioPagoNombre', 'El nombre del medio de pago es obligatorio').notEmpty()
], MedioPagoController.MedioPagoCreate);
router.put('/update', ValidarJWT, [
    check('MedioPagoNombre', 'El nombre del medio de pago es obligatorio').notEmpty()
], MedioPagoController.MedioPagoUpdate);
router.put('/delete', ValidarJWT, MedioPagoController.MedioPagoDelete);
module.exports = router;