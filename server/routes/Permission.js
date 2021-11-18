const express = require('express');
const ValidarJWT = require('../middlewares/ValidarJWT');
const router = express.Router();
const PermissionController = require('./../controllers/PermissionController');

router.get('/', ValidarJWT, PermissionController.PermissionGet);
router.get('/:RoleId', ValidarJWT, PermissionController.PermissionGetByRole);
module.exports = router;