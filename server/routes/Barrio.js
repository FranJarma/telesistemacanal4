const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const BarrioController = require('../controllers/BarrioController');
const ValidarJWT = require('../middlewares/ValidarJWT');

router.get('/', ValidarJWT, BarrioController.BarriosGet);
router.get('/municipio=:id', ValidarJWT, BarrioController.BarriosListarPorMunicipio);
router.post('/create', ValidarJWT, [
    check('BarrioNombre', 'El nombre del barrio es obligatorio').notEmpty(),
    check('MunicipioIdModal', 'El municipio es obligatorio').notEmpty(),
], BarrioController.BarrioCreate);
router.put('/update', ValidarJWT, [
    check('BarrioNombre', 'El nombre del servicio es obligatorio').notEmpty(),
    check('MunicipioIdModal', 'El municipio es obligatorio').notEmpty(),
], BarrioController.BarrioUpdate);
router.put('/delete', ValidarJWT, BarrioController.BarrioDelete);
module.exports = router;