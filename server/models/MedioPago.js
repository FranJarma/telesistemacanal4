const { STRING, INTEGER, UUIDV4, DATE, FLOAT } = require('sequelize');
const db = require('../config/connection');

const MedioPago = db.define('mediopago', {
    MedioPagoId: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true
    },
    MedioPagoNombre: {
        type: STRING(256),
        allowNull: false
    },
    MedioPagoCantidadCuotas: {
        type: INTEGER
    },
    MedioPagoDescripcion: {
        type: STRING(256),
        allowNull: true
    },
    MedioPagoInteres: {
        type: FLOAT,
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
    }
});

module.exports = db.model('mediopago', MedioPago);