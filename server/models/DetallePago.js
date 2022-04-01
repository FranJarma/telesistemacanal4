const { STRING, INTEGER, FLOAT, DATE, UUIDV4 } = require('sequelize');
const db = require('../config/connection');

const DetallePago = db.define('detallepago', {
    DetallePagoId: {
        type: INTEGER,
        primaryKey: true
    },
    DetallePagoMonto: {
        type: FLOAT,
        allowNull: false
    },
    DetallePagoObservaciones: {
        type: STRING,
        allowNull: true
    },
    createdAt: {
        type: DATE,
        allowNull: true,
    },
    createdBy: {
        type: UUIDV4,
        allowNull: true
    },
    updatedAt: {
        type: DATE,
        allowNull: true,
    },
    updatedBy: {
        type: UUIDV4,
        allowNull: true
    },
    deletedAt: {
        type: DATE,
        allowNull: true,
    },
    deletedBy: {
        type: UUIDV4,
        allowNull: true
    },
    //fk
    MovimientoId: {
        type: INTEGER,
        allowNull: false
    },
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