const { UUIDV4 } = require('sequelize');
const db = require('../config/connection');

const RolePermission = db.define('_rolepermission', {
    PermissionId: {
        type: UUIDV4,
        primaryKey: true
    },
    RoleId: {
        type: UUIDV4,
        primaryKey: true
    }
});

module.exports = db.model('_rolepermission', RolePermission);