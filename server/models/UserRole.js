const { Sequelize, UUIDV4 } = require('sequelize');
const db = require('../config/connection');

const UserRole = db.define('_userrole', {
    UserId: {
        type: UUIDV4
    },
    RoleId: {
        type: UUIDV4
    }
});

module.exports = db.model('_userrole', UserRole);