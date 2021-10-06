const express = require('express');
const router = express.Router();
const BarrioController = require('../controllers/BarrioController');

router.get('/municipio=:id', BarrioController.BarriosListarPorMunicipio);

module.exports = router;