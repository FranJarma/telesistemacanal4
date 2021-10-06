const express = require('express');
const router = express.Router();
const MunicipioController = require('../controllers/MunicipioController');

router.get('/provincia=:id', MunicipioController.MunicipiosListarPorProvincia);

module.exports = router;