const express = require('express');
const router = express.Router();
const PagoController = require('../controllers/PagoController');
const { check } = require('express-validator');
const ValidarJWT = require('../middlewares/ValidarJWT');

router.get('/UserId=:UserId&Periodo=:Periodo', ValidarJWT, PagoController.PagosListarPorUsuario);
router.get('/UserId=:UserId&Concepto=:Concepto&top=:top', ValidarJWT, PagoController.PagosMensualesPendientes);
router.get('/UserId=:UserId&Periodo=:PagoAño&PagoMes=:PagoMes', ValidarJWT, PagoController.PagoGet);
router.get('/UserId=:UserId&Inscripcion=:Inscripcion', ValidarJWT, PagoController.PagosTraerInscripcion);
router.post('/create', ValidarJWT,
[
    check('MedioPagoId', 'El medio de pago es obligatorio').notEmpty(),
], PagoController.PagoCreate);
router.post('/createPagoAdelantado', ValidarJWT,
[
    check('PagoAdelantadoInfo.CantidadMesesAPagar', 'Seleccione la cantidad de meses a pagar').notEmpty(),
    check('PagoAdelantadoInfo.MedioPagoId', 'El medio de pago es obligatorio').notEmpty()
], PagoController.PagoAdelantadoCreate);
router.put('/recargo', ValidarJWT,
[
    check('PagoRecargo', 'El monto del recargo no puede ser $ 0').notEmpty()
], PagoController.PagoAñadirRecargo);
router.put('/recargo/delete', ValidarJWT, PagoController.PagoEliminarRecargo);

module.exports = router;