const express = require('express');
const router = express.Router();
const MunicipioController = require('../controllers/MunicipioController');
const { check } = require('express-validator');

router.get('/provincia=:id', MunicipioController.MunicipiosListarPorProvincia);

module.exports = router;