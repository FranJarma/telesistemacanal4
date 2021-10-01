const { Sequelize, UUIDV4 } = require('sequelize');
const db = require('../config/connection');

const UserRole = db.define('_userrole', {
    UserId: {
        type: UUIDV4,
        primaryKey: true
    },
    RoleId: {
        type: UUIDV4,
        primaryKey: true
    }
});

module.exports = db.model('_userrole', UserRole);