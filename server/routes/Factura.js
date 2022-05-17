const express = require('express');
const router = express.Router();
const FacturaController = require('../controllers/FacturaController');
const ValidarJWT = require('../middlewares/ValidarJWT');

router.get('/UserId=:UserId&Periodo=:Periodo', ValidarJWT, FacturaController.FacturasListarPorUsuario);

module.exports = router;