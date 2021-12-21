const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const OtController = require('../controllers/OtController');
const ValidarJWT = require('../middlewares/ValidarJWT');

router.get('/', ValidarJWT, OtController.OtGet);
router.get('/tecnicos/:OtId', ValidarJWT, OtController.OtObtenerTecnicos);
router.get('/tareas/:OtId', ValidarJWT, OtController.OtObtenerTareas);

router.post('/create', ValidarJWT, [
    check('OtFechaPrevistaVisita', 'La fecha prevista de visita es obligatoria').notEmpty(),
    check('tecnicos', 'Seleccione el o los técnicos encargados').notEmpty(),
    check('abonado', 'El abonado es obligatorio').notEmpty(),
    check('tareasOt', 'Seleccione el o las tareas a realizar').notEmpty()
], OtController.OtCreate);
module.exports = router;

