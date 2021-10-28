const { UUIDV4, STRING, INTEGER } = require('sequelize');
const db = require('../config/connection');

const Servicio = db.define('servicio', {
    ServicioId: {
        type: UUIDV4,
        primaryKey: true
    },
    ServicioNombre: {
        type: STRING(256),
        unique: true,
        allowNull: true,
    },
    ServicioPrecioUnitario: {
        type: INTEGER,
        allowNull: false
    },
    ServicioDescripcion: {
        type: STRING(256),
        allowNull: false
    },
    ServicioEliminado: {
        type: INTEGER,
        defaultValue: 0
    }
});

module.exports = Servicio;