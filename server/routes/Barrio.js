const express = require('express');
const router = express.Router();
const BarrioController = require('../controllers/BarrioController');
const { check } = require('express-validator');

router.get('/municipio=:id', BarrioController.BarriosListarPorMunicipio);

module.exports = router;