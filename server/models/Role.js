const { UUIDV4, STRING, DATE } = require('sequelize');
const db = require('../config/connection');

const Role = db.define('_role', {
    RoleId: {
        type: UUIDV4,
        primaryKey: true
    },
    RoleName: {
        type: STRING(256),
        allowNull: false
    },
    RoleDescription: {
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

module.exports = db.model('_role', Role);