const express = require('express');
const router = express.Router();
const PagoController = require('../controllers/PagoController');
const { check } = require('express-validator');

router.get('/:UserId', PagoController.PagosListarPorUsuario);
router.get('/', PagoController.GetPago);

router.post('/create',
[
    check('MedioPagoId', 'El medio de pago es obligatorio').not().contains(0),
    check('DetallePagoMonto', 'El monto es obligatorio').notEmpty(),
], PagoController.PagoCreate);
module.exports = router;