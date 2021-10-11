const { UUIDV4, INTEGER, STRING, DATE } = require('sequelize');
const db = require('../config/connection');

const UserServicio = db.define('userservicio', {
    UserServicioId: {
        type: INTEGER,
        primaryKey: true
    },
    UserId: {
        type: UUIDV4
    },
    ServicioId: {
        type: INTEGER
    },
    CambioServicioFecha: {
        type: DATE
    },
    CambioServicioObservaciones: {
        type: STRING
    }
});

module.exports = db.model('userservicio', UserServicio);