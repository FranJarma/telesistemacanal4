const { UUIDV4, INTEGER, STRING, DATE } = require('sequelize');
const db = require('../config/connection');

const UserEstado = db.define('userestado', {
    UserEstadoId: {
        type: INTEGER,
        primaryKey: true
    },
    UserId: {
        type: UUIDV4
    },
    EstadoId: {
        type: INTEGER
    },
    CambioEstadoObservaciones: {
        type: STRING
    },
    createdAt: {
        type: DATE,
        allowNull: true,
    },
    createdBy: {
        type: UUIDV4,
        allowNull: true
    }
});

module.exports = db.model('userestado', UserEstado);