const express = require('express');
const router = express.Router();
const ProvinciaController = require('../controllers/ProvinciaController');

router.get('/', ProvinciaController.ProvinciasListar);

module.exports = router;