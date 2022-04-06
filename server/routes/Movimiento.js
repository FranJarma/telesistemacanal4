const express = require('express');
const router = express.Router();
const MovimientoController = require('../controllers/MovimientoController');
const { check } = require('express-validator');
const ValidarJWT = require('../middlewares/ValidarJWT');

router.post('/create', ValidarJWT, [
    check('MovimientoConcepto', 'El concepto es obligatorio').notEmpty(),
    check('MovimientoCantidad.MovimientoPesos', 'La cantidad de Pesos es obligatoria').notEmpty(),
], MovimientoController.MovimientoCreate);
router.get('/', ValidarJWT, MovimientoController.MovimientosGetByFecha);
// router.get('/abonado', ValidarJWT, MovimientoController.MovimientosAbonadoGet);

module.exports = router;