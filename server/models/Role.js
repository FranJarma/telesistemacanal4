const { Sequelize, UUIDV4, STRING } = require('sequelize');
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
    Description: {
        type: STRING(256),
        allowNull: true
    }
});

module.exports = db.model('_role', Role);