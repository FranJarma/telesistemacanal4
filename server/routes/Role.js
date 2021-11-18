const express = require('express');
const router = express.Router();
const RoleController = require('./../controllers/RoleController');
const { check } = require('express-validator');
const ValidarJWT = require('../middlewares/ValidarJWT');

router.get('/', ValidarJWT, RoleController.RolesGet);
router.get('/:UserId', ValidarJWT, RoleController.RolesGetByUser);
router.post('/create', ValidarJWT,
[
    check('RoleName', 'El nombre es obligatorio').notEmpty(),
    check('RoleDescription', 'El apellido es obligatorio').notEmpty(),
    check('PermisosSeleccionados', 'Seleccione permisos desde el botón Asignar Permisos').notEmpty(),
], RoleController.RoleCreate);

router.put('/update/:id', ValidarJWT,
[
    check('RoleName', 'El nombre es obligatorio').notEmpty(),
    check('RoleDescription', 'El apellido es obligatorio').notEmpty()
],RoleController.RoleUpdate);

router.put('/delete/:id', ValidarJWT, RoleController.RoleDelete);
module.exports = router;