const express = require('express');
const router = express.Router();
const ModeloOnu = require('../controllers/ModeloOnuController');

router.get('/', ModeloOnu.ModelosOnuListar);

module.exports = router;