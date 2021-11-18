const express = require('express');
const router = express.Router();
const ProvinciaController = require('../controllers/ProvinciaController');
const ValidarJWT = require('../middlewares/ValidarJWT');

router.get('/', ValidarJWT, ProvinciaController.ProvinciasListar);

module.exports = router;