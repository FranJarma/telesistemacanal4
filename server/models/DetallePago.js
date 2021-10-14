const { STRING, INTEGER, FLOAT } = require('sequelize');
const db = require('../config/connection');

const DetallePago = db.define('detallepago', {
    DetallePagoId: {
        type: INTEGER,
        allowNull: false,
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
    //fk
    PagoId: {
        type: INTEGER,
        allowNull: false
    },
    MedioPagoId: {
        type: INTEGER,
        allowNull: false
    },
    UserId: {
        type: STRING(38),
        allowNull: false
    },
});

module.exports = db.model('detallepago', DetallePago);