const express = require('express');
const router = express.Router();
const MedioPago = require('../controllers/MedioPagoController');

router.get('/', MedioPago.MediosDePagoListar);

module.exports = router;