const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const TareaController = require('../controllers/TareaController');
const ValidarJWT = require('../middlewares/ValidarJWT');

router.get('/', ValidarJWT, TareaController.TareasGet);

module.exports = router;


