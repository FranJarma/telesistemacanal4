const express = require('express');
const router = express.Router();
const CondicionesIVA = require('../controllers/CondicionesIVAController');
const { check } = require('express-validator');

router.get('/', CondicionesIVA.CondicionesIVAListar);

module.exports = router;