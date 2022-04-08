const { INTEGER, DATE, UUIDV4, TINYINT, FLOAT, STRING } = require('sequelize');
const db = require('../config/connection');

const Caja = db.define('caja', {
    CajaId: {
        type: INTEGER,
        primaryKey: true
    },
    CajaDia: {
        type: INTEGER,
        allowNull: false
    },
    CajaMes: {
        type: INTEGER,
        allowNull: false
    },
    CajaAño: {
        type: INTEGER,
        allowNull: false
    },
    CajaMunicipio: {
        type: INTEGER,
        allowNull: false
    },
    CajaTurno: {
        type: STRING,
        allowNull: false
    },
    CajaCerradaFecha: {
        type: DATE,
        allowNull: false
    },
    CajaCerradaUser: {
        type: UUIDV4,
        allowNull: false
    },
    CajaRecibeUser: {
        type: UUIDV4,
        allowNull: false
    },
    CajaReAbiertaFecha: {
        type: DATE,
        allowNull: true
    },
    CajaReAbiertaUser: {
        type: UUIDV4,
        allowNull: true
    },
    CajaTotal: {
        type: FLOAT,
        allowNull: false
    },
    CajaTotalSistema: {
        type: FLOAT,
        allowNull: false
    },
    CajaCierreObservaciones: {
        type: STRING,
        allowNull: true
    }
});

module.exports = Caja;