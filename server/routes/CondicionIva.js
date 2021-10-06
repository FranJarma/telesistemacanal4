const express = require('express');
const router = express.Router();
const CondicionIva = require('../controllers/CondicionIvaController');

router.get('/', CondicionIva.CondicionesIvaListar);

module.exports = router;