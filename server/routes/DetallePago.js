const express = require('express');
const router = express.Router();
const DetallesPagoController = require('../controllers/DetallesPagoController');

router.get('/:id', DetallesPagoController.DetallesPagoListar);
router.put('/delete', DetallesPagoController.DetallePagoDelete);
module.exports = router;