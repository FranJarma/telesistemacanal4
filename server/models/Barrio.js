const { STRING, INTEGER, DATE, UUIDV4 } = require('sequelize');
const db = require('../config/connection');

const Barrio = db.define('barrio', {
    BarrioId: {
        type: INTEGER,
        primaryKey: true
    },
    BarrioNombre: {
        type: STRING(256),
        allowNull: false
    },
    MunicipioId: {
        type: INTEGER,
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

module.exports = db.model('barrio', Barrio);