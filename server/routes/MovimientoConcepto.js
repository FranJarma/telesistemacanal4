const express = require('express');
const router = express.Router();
const MovimientoConceptoController = require('../controllers/MovimientoConceptoController');
const { check } = require('express-validator');
const ValidarJWT = require('../middlewares/ValidarJWT');

router.get('/', ValidarJWT, MovimientoConceptoController.MovimientosConceptosGet);

module.exports = router;