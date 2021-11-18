const express = require('express');
const router = express.Router();
const CondicionIva = require('../controllers/CondicionIvaController');
const ValidarJWT = require('../middlewares/ValidarJWT');

router.get('/', ValidarJWT,  CondicionIva.CondicionesIvaListar);

module.exports = router;