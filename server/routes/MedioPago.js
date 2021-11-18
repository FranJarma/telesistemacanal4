const express = require('express');
const router = express.Router();
const MedioPago = require('../controllers/MedioPagoController');
const ValidarJWT = require('../middlewares/ValidarJWT');

router.get('/', ValidarJWT, MedioPago.MediosDePagoListar);

module.exports = router;