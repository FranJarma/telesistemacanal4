const express = require('express');
const router = express.Router();
const RoleController = require('./../controllers/RoleController');
const { check } = require('express-validator');

router.get('/', RoleController.RolesGet);
router.get('/:UserId', RoleController.RolesGetByUser);
router.post('/create',
[
    check('RoleName', 'El nombre es obligatorio').notEmpty(),
    check('RoleDescription', 'El apellido es obligatorio').notEmpty(),
    check('PermisosSeleccionados', 'Seleccione permisos desde el botón Asignar Permisos').notEmpty(),
], RoleController.RoleCreate);

router.put('/update/:id',
[
    check('RoleName', 'El nombre es obligatorio').notEmpty(),
    check('RoleDescription', 'El apellido es obligatorio').notEmpty()
],RoleController.RoleUpdate);

router.put('/delete/:id', RoleController.RoleDelete);
module.exports = router;