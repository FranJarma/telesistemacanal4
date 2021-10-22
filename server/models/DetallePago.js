const { STRING, INTEGER, FLOAT, DATE } = require('sequelize');
const db = require('../config/connection');

const DetallePago = db.define('detallepago', {
    DetallePagoId: {
        type: INTEGER,
        primaryKey: true
    },
    DetallePagoFecha: {
        type: DATE,
        allowNull: false
    },
    DetallePagoMonto: {
        type: FLOAT,
        allowNull: false
    },
    DetallePagoObservaciones: {
        type: STRING,
        allowNull: true
    },
    //fk
    PagoId: {
        type: INTEGER,
        allowNull: false
    },
    MedioPagoId: {
        type: INTEGER,
        allowNull: false
    }
});

module.exports = db.model('detallepago', DetallePago);