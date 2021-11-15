const { UUIDV4, STRING } = require('sequelize');
const db = require('../config/connection');

const Permission = db.define('_permission', {
    PermissionId: {
        type: UUIDV4,
        primaryKey: true
    },
    PermissionName: {
        type: STRING(256),
        allowNull: false
    },
    Description: {
        type: STRING(256),
        allowNull: true
    }
});

module.exports = db.model('_permission', Permission);