const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const ModeloOnuController = require('../controllers/ModeloOnuController');
const ValidarJWT = require('../middlewares/ValidarJWT');

router.get('/', ValidarJWT, ModeloOnuController.ModelosOnuGet);
router.post('/create', ValidarJWT, [
    check('ModeloOnuNombre', 'El nombre es obligatorio').notEmpty(),
], ModeloOnuController.ModeloOnuCreate);
router.put('/update', ValidarJWT, [
    check('ModeloOnuNombre', 'El nombre es obligatorio').notEmpty(),
], ModeloOnuController.ModeloOnuUpdate);
router.put('/delete', ValidarJWT, ModeloOnuController.ModeloOnuDelete);
module.exports = router;