const express = require('express');
const router = express.Router();
const MovimientoController = require('../controllers/MovimientoController');
const { check } = require('express-validator');
const ValidarJWT = require('../middlewares/ValidarJWT');

router.post('/create', ValidarJWT, [
    check('MovimientoCantidad', 'La cantidad del movimiento es obligatoria').notEmpty(),
    check('MovimientoConceptoId', 'El concepto es obligatorio').notEmpty(),
], MovimientoController.MovimientoCreate);
router.get('/Dia=:Dia&Mes=:Mes&Anio=:Anio', ValidarJWT, MovimientoController.MovimientosGetByFecha);

module.exports = router;