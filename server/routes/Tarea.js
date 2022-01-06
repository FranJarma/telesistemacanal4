const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const TareaController = require('../controllers/TareaController');
const ValidarJWT = require('../middlewares/ValidarJWT');

router.get('/', ValidarJWT, TareaController.TareasGet);
router.post('/create', ValidarJWT, [
    check('TareaNombre', 'El nombre de la tarea es obligatoria').notEmpty(),
    check('TareaPrecioUnitario', 'El precio unitario es obligatorio').notEmpty(),
], TareaController.TareaCreate);
router.put('/update', ValidarJWT, [
    check('TareaNombre', 'El nombre de la tarea es obligatoria').notEmpty(),
    check('TareaPrecioUnitario', 'El precio unitario es obligatorio').notEmpty(),
], TareaController.TareaUpdate);
router.put('/delete', ValidarJWT, TareaController.TareaDelete);
module.exports = router;


