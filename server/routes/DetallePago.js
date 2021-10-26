const express = require('express');
const router = express.Router();
const DetallesPagoController = require('../controllers/DetallesPagoController');

router.get('/:id', DetallesPagoController.DetallesPagoListar);

module.exports = router;