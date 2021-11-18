const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const MunicipioController = require('../controllers/MunicipioController');
const ValidarJWT = require('../middlewares/ValidarJWT');

router.get('/', ValidarJWT, MunicipioController.MunicipiosGet);
router.get('/provincia=:id', ValidarJWT, MunicipioController.MunicipiosListarPorProvincia);
router.post('/create', ValidarJWT, [
    check('MunicipioNombre', 'El nombre del municipio es obligatorio').notEmpty(),
    check('MunicipioCodigoPostal', 'El codigo postal del municipio es obligatorio').notEmpty(),
    check('ProvinciaIdModal', 'La provincia es obligatoria').notEmpty(),
], MunicipioController.MunicipioCreate);
router.put('/update', ValidarJWT, [
    check('MunicipioNombre', 'El nombre del municipio es obligatorio').notEmpty(),
    check('MunicipioCodigoPostal', 'El codigo postal del municipio es obligatorio').notEmpty(),
    check('ProvinciaIdModal', 'La provincia es obligatoria').notEmpty(),
], MunicipioController.MunicipioUpdate);
router.put('/delete', ValidarJWT, MunicipioController.MunicipioDelete);
module.exports = router;

