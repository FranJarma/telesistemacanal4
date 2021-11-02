const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const OnuController = require('../controllers/OnuController');
const { esOnuValida } =  require('./../helpers/db-validaciones');

router.get('/estado=:estadoId', OnuController.OnuGet);
router.get('/:id', OnuController.OnuGetById);
router.post('/create', [
    check('OnuSerie', 'La serie es obligatoria').notEmpty(),
    check('OnuMac', 'La MAC es obligatoria').notEmpty(),
    check('ModeloOnuId', 'El modelo es obligatorio').notEmpty(),
    check('OnuMac').custom(esOnuValida)
], OnuController.OnuCreate);
router.put('/update', [
    check('OnuSerie', 'La serie es obligatoria').notEmpty(),
    check('OnuMac', 'La MAC es obligatoria').notEmpty(),
    check('ModeloOnuId', 'El modelo es obligatorio').notEmpty(),
    check('OnuMac').custom(esOnuValida)
], OnuController.OnuUpdate);
router.put('/delete', OnuController.OnuDelete);
module.exports = router;