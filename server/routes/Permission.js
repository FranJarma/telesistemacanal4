const express = require('express');
const router = express.Router();
const PermissionController = require('./../controllers/PermissionController');

router.get('/', PermissionController.PermissionGet);
router.get('/:RoleId', PermissionController.PermissionGetByRole);
module.exports = router;