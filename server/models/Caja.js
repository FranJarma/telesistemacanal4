const { INTEGER, DATE, UUIDV4, TINYINT, FLOAT } = require('sequelize');
const db = require('../config/connection');

const Caja = db.define('caja', {
    CajaId: {
        type: INTEGER,
        primaryKey: true
    },
    CajaFecha: {
        type: DATE,
        unique: true,
        allowNull: false
    },
    CajaCerrada: {
        type: TINYINT,
        allowNull: false
    },
    CajaCerradaUserId: {
        type: UUIDV4,
        allowNull: false
    },
    CajaTotalVentas: {
        type: FLOAT,
        allowNull: false
    }
});

module.exports = Caja;