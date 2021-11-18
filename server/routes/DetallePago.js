const express = require('express');
const router = express.Router();
const DetallesPagoController = require('../controllers/DetallesPagoController');
const ValidarJWT = require('../middlewares/ValidarJWT');

router.get('/:id', ValidarJWT, DetallesPagoController.DetallesPagoListar);
router.put('/delete', ValidarJWT, DetallesPagoController.DetallePagoDelete);
module.exports = router;