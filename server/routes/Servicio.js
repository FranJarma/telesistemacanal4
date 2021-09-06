const express = require('express');
const router = express.Router();
const ServicioController = require('../controllers/ServicioController');
const { check } = require('express-validator');

router.get('/', ServicioController.ServiciosListar);

module.exports = router;