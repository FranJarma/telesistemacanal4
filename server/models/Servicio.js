const { STRING, INTEGER, FLOAT } = require('sequelize');
const db = require('../config/connection');

const Servicio = db.define('servicio', {
    ServicioId: {
        type: INTEGER,
        primaryKey: true
    },
    ServicioNombre: {
        type: STRING(256),
        unique: true,
        allowNull: true,
    },
    ServicioPrecioUnitario: {
        type: FLOAT,
        allowNull: false
    },
    ServicioRecargo: {
        type: FLOAT,
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