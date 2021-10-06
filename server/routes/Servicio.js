const express = require('express');
const router = express.Router();
const ServicioController = require('../controllers/ServicioController');

router.get('/', ServicioController.ServiciosListar);

module.exports = router;