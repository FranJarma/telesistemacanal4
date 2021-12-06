const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const TipoTareaController = require('../controllers/TipoTareaController');
const ValidarJWT = require('../middlewares/ValidarJWT');

router.get('/', ValidarJWT, TipoTareaController.TiposTareaGet);

module.exports = router;


