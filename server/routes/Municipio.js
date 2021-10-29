const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const MunicipioController = require('../controllers/MunicipioController');

router.get('/provincia=:id', MunicipioController.MunicipiosListarPorProvincia);
router.post('/create', [
    check('MunicipioNombre', 'El nombre del municipio es obligatorio').notEmpty(),
    check('MunicipioCodigoPostal', 'El codigo postal del municipio es obligatorio').notEmpty(),
    check('ProvinciaId', 'La provincia es obligatoria').notEmpty(),
], MunicipioController.MunicipioCreate);
router.put('/update', [
    check('MunicipioNombre', 'El nombre del municipio es obligatorio').notEmpty(),
    check('MunicipioCodigoPostal', 'El codigo postal del municipio es obligatorio').notEmpty(),
    check('ProvinciaId', 'La provincia es obligatoria').notEmpty(),
], MunicipioController.MunicipioUpdate);
router.put('/delete', MunicipioController.MunicipioDelete);
module.exports = router;

