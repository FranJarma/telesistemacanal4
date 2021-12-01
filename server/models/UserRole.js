const { UUIDV4, DATE } = require('sequelize');
const db = require('../config/connection');

const UserRole = db.define('_userrole', {
    UserId: {
        type: UUIDV4,
        primaryKey: true
    },
    RoleId: {
        type: UUIDV4,
        primaryKey: true
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
module.exports = db.model('_userrole', UserRole);