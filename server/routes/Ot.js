const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const OtController = require('../controllers/OtController');
const ValidarJWT = require('../middlewares/ValidarJWT');

router.get('/estado=:estadoId', ValidarJWT, OtController.OtGet);
router.get('/tecnico=:tecnicoId&estado=:estadoId', ValidarJWT, OtController.OtGetByTecnico);
router.get('/tecnicos/:OtId', ValidarJWT, OtController.OtObtenerTecnicos);
router.get('/tareas/:OtId', ValidarJWT, OtController.OtObtenerTareas);

router.post('/create', ValidarJWT, [
    check('OtFechaPrevistaVisita', 'La fecha prevista de visita es obligatoria').notEmpty(),
    check('tecnicosOt', 'Seleccione el o los técnicos encargados').notEmpty(),
    check('abonado', 'El abonado es obligatorio').notEmpty(),
    check('tareasOt', 'Seleccione el o las tareas a realizar').notEmpty()
], OtController.OtCreate);

router.put('/update', ValidarJWT, [
    check('OtFechaPrevistaVisita', 'La fecha prevista de visita es obligatoria').notEmpty(),
    check('tecnicosOt', 'Seleccione el o los técnicos encargados').notEmpty(),
    check('tareasOt', 'Seleccione el o las tareas a realizar').notEmpty()
], OtController.OtUpdate);

router.put('/finalizar-ot', ValidarJWT, [
    check('OtFechaFinalizacion', 'La fecha de finalización es obligatoria').notEmpty(),
    check('OtHoraInicio', 'La hora de inicio es obligatoria').notEmpty(),
    check('OtHoraFin', 'La hora de finalización es obligatoria').notEmpty(),
], OtController.OtFinalizar);

router.put('/registrar-visita', ValidarJWT, OtController.OtRegistrarVisita);

module.exports = router;

