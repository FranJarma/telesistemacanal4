const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const OnuController = require('../controllers/OnuController');
const { esOnuValida } =  require('./../helpers/db-validaciones');
const ValidarJWT = require('../middlewares/ValidarJWT');

router.get('/estado=:estadoId', ValidarJWT, OnuController.OnuGet);
router.get('/:id', ValidarJWT, OnuController.OnuGetById);
router.post('/create', ValidarJWT, [
    check('OnuSerie', 'La serie es obligatoria').notEmpty(),
    check('OnuMac', 'La MAC es obligatoria').notEmpty(),
    check('ModeloOnuId', 'El modelo es obligatorio').notEmpty(),
    check('OnuMac').custom(esOnuValida)
], OnuController.OnuCreate);
router.put('/update', ValidarJWT, [
    check('OnuSerie', 'La serie es obligatoria').notEmpty(),
    check('OnuMac', 'La MAC es obligatoria').notEmpty(),
    check('ModeloOnuId', 'El modelo es obligatorio').notEmpty(),
], OnuController.OnuUpdate);
router.put('/delete', ValidarJWT, OnuController.OnuDelete);
module.exports = router;