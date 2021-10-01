const { UUIDV4, INTEGER, STRING, DATE } = require('sequelize');
const db = require('../config/connection');

const UserServicio = db.define('userservicio', {
    UserId: {
        type: UUIDV4,
        primaryKey: true
    },
    ServicioId: {
        type: INTEGER,
        primaryKey: true
    },
    CambioServicioFecha: {
        type: DATE
    },
    CambioServicioObservaciones: {
        type: STRING
    }
});

module.exports = db.model('userservicio', UserServicio);