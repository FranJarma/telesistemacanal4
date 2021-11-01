const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const OnuController = require('../controllers/OnuController');

router.get('/', OnuController.OnuGet);
router.post('/create', [
    check('OnuSerie', 'La serie es obligatoria').notEmpty(),
    check('OnuMac', 'La MAC es obligatoria').notEmpty(),
    check('ModeloOnuId', 'El modelo es obligatorio').notEmpty(),
], OnuController.OnuCreate);
router.put('/update', [
    check('OnuSerie', 'La serie es obligatoria').notEmpty(),
    check('OnuMac', 'La MAC es obligatoria').notEmpty(),
    check('ModeloOnuId', 'El modelo es obligatorio').notEmpty(),
], OnuController.OnuUpdate);
router.put('/delete', OnuController.OnuDelete);
module.exports = router;