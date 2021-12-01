const { STRING, UUIDV4, DATE } = require('sequelize');
const db = require('../config/connection');

const Provincia = db.define('provincia', {
    NombreProvincia: {
        type: STRING(256),
        allowNull: false
    },
    SiglaProvincia: {
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

module.exports = db.model('provincia', Provincia);