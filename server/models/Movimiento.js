const { INTEGER, FLOAT, DATE, UUIDV4, STRING } = require('sequelize');
const db = require('../config/connection');

const Movimiento = db.define('movimiento', {
    MovimientoId: {
        type: INTEGER,
        primaryKey: true
    },
    MovimientoCantidad: {
        type: FLOAT,
        allowNull: false
    },
    MovimientoDia: {
        type: INTEGER,
        allowNull: true
    },
    MovimientoMes: {
        type: INTEGER,
        allowNull: true
    },
    MovimientoAño: {
        type: INTEGER,
        allowNull: true
    },
    MovimientoConceptoId: {
        type: INTEGER,
        allowNull: false
    },
    // CajaId: {
    //     type: INTEGER,
    //     allowNull: false
    // },
    PagoId: {
        type: INTEGER,
        allowNull: true
    },
    OtId: {
        type: INTEGER,
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

module.exports = Movimiento;