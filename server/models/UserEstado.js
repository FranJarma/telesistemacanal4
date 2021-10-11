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
    CambioEstadoFecha: {
        type: DATE
    },
    CambioEstadoObservaciones: {
        type: STRING
    }
});

module.exports = db.model('userestado', UserEstado);