const express = require('express');
const router = express.Router();
const ProvinciaController = require('../controllers/ProvinciaController');
const { check } = require('express-validator');

router.get('/', ProvinciaController.ProvinciasListar);

module.exports = router;