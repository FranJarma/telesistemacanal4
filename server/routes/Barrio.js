const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const BarrioController = require('../controllers/BarrioController');

router.get('/', BarrioController.BarriosGet);
router.get('/municipio=:id', BarrioController.BarriosListarPorMunicipio);
router.post('/create', [
    check('BarrioNombre', 'El nombre del barrio es obligatorio').notEmpty(),
    check('MunicipioIdModificar', 'El municipio es obligatorio').notEmpty(),
], BarrioController.BarrioCreate);
router.put('/update', [
    check('BarrioNombre', 'El nombre del servicio es obligatorio').notEmpty(),
    check('MunicipioIdModificar', 'El municipio es obligatorio').notEmpty(),
], BarrioController.BarrioUpdate);
router.put('/delete', BarrioController.BarrioDelete);
module.exports = router;