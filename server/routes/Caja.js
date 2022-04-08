const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const CajaController = require('../controllers/CajaController');
const ValidarJWT = require('../middlewares/ValidarJWT');

router.get('/', ValidarJWT, CajaController.CajaGet);
router.post('/create', ValidarJWT,
[
    check('CajaRecibeUser', 'El usuario que recibe la caja es obligatorio').notEmpty(),
    check('CajaPesos', 'El total de la caja física es obligatorio').notEmpty()
], CajaController.CajaCerrar);

module.exports = router;