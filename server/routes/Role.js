const express = require('express');
const router = express.Router();
const RoleController = require('./../controllers/RoleController');

router.get('/', RoleController.RolesGet);

module.exports = router;