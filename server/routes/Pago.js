const express = require('express');
const router = express.Router();
const PagoController = require('../controllers/PagoController');
const { check } = require('express-validator');
const ValidarJWT = require('../middlewares/ValidarJWT');

router.get('/UserId=:UserId&Periodo=:Periodo', ValidarJWT, PagoController.PagosListarPorUsuario);
router.get('/UserId=:UserId&Periodo=:PagoAño&PagoMes=:PagoMes', ValidarJWT, PagoController.PagoGet);
router.get('/UserId=:UserId&Inscripcion=:Inscripcion', ValidarJWT, PagoController.PagosTraerInscripcion);
router.post('/create', ValidarJWT,
[
    check('MedioPagoId', 'El medio de pago es obligatorio').not().contains(0),
    check('DetallePagoMonto', 'El monto es obligatorio').notEmpty(),
], PagoController.PagoCreate);
router.put('/recargo', ValidarJWT,
[
    check('PagoRecargo', 'El monto del recargo no puede ser $ 0').notEmpty()
], PagoController.PagoAñadirRecargo);
router.put('/recargo/delete', ValidarJWT, PagoController.PagoEliminarRecargo);

module.exports = router;