const { UUIDV4, INTEGER, STRING, DATE } = require('sequelize');
const db = require('../config/connection');

const UserEstado = db.define('userestado', {
    UserId: {
        type: UUIDV4,
        primaryKey: true
    },
    EstadoId: {
        type: INTEGER,
        primaryKey: true
    },
    CambioEstadoFecha: {
        type: DATE
    },
    CambioEstadoObservaciones: {
        type: STRING
    }
});

module.exports = db.model('userestado', UserEstado);