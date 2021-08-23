const express = require('express');
const router = express.Router();
const UserController = require('./../controllers/UserController');
const { check } = require('express-validator');

router.get('/activos', UserController.AbonadosActivosListar);
router.get('/inactivos', UserController.AbonadosInactivosListar);
router.get('/create', UserController.AbonadoCreate);
router.get('/delete/:id', UserController.AbonadoEliminar);

module.exports = router;