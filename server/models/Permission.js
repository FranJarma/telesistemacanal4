const { UUIDV4, STRING, UUIDV4, DATE } = require('sequelize');
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
    PermissionDescription: {
        type: STRING(256),
        allowNull: true
    },
    createdAt: {
        type: DATE,
        allowNull: true,
    },
    createdBy: {
        type: UUIDV4,
        allowNull: true
    },
    updatedAt: {
        type: DATE,
        allowNull: true,
    },
    updatedBy: {
        type: UUIDV4,
        allowNull: true
    },
    deletedAt: {
        type: DATE,
        allowNull: true,
    },
    deletedBy: {
        type: UUIDV4,
        allowNull: true
    }
});

module.exports = db.model('_permission', Permission);