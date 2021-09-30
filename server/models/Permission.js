const { Sequelize, Datatypes } = require('sequelize');
const db = require('../config/connection');

const Permission = db.define('Permission', {
    PermissionId: {
        type: Datatypes.UUID,
        defaultValue: Sequelize.UUIDV1
    },
    PermissionName: {
        type: Datatypes.STRING(256),
        allowNull: false
    },
    Description: {
        type: Datatypes.STRING(256),
        allowNull: true
    }
});