const express = require('express');
const router = express.Router();
const RoleController = require('./../controllers/RoleController');

router.get('/', RoleController.RolesGet);
router.get('/:UserId', RoleController.RolesGetByUser);
module.exports = router;