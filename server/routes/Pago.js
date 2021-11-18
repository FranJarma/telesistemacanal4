const express = require('express');
const router = express.Router();
const PagoController = require('../controllers/PagoController');
const { check } = require('express-validator');
const ValidarJWT = require('../middlewares/ValidarJWT');

router.get('/:UserId', ValidarJWT, PagoController.PagosListarPorUsuario);
router.get('/', ValidarJWT, PagoController.PagoGet);

router.post('/create', ValidarJWT,
[
    check('MedioPagoId', 'El medio de pago es obligatorio').not().contains(0),
    check('DetallePagoMonto', 'El monto es obligatorio').notEmpty(),
], PagoController.PagoCreate);
module.exports = router;