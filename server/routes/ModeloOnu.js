const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const ModeloOnuController = require('../controllers/ModeloOnuController');

router.get('/', ModeloOnuController.ModelosOnuGet);
router.post('/create', [
    check('ModeloOnuNombre', 'El nombre es obligatorio').notEmpty(),
], ModeloOnuController.ModeloOnuCreate);
router.put('/update', [
    check('ModeloOnuNombre', 'El nombre es obligatorio').notEmpty(),
], ModeloOnuController.ModeloOnuUpdate);
router.put('/delete', ModeloOnuController.ModeloOnuDelete);
module.exports = router;