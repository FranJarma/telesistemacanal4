const { INTEGER, FLOAT, DATE, UUIDV4, STRING } = require('sequelize');
const db = require('../config/connection');

const MovimientoConcepto = db.define('movimientoconcepto', {
    MovimientoConceptoId: {
        type: INTEGER,
        primaryKey: true
    },
    MovimientoConceptoNombre: {
        type: FLOAT,
        allowNull: false
    },
    MovimientoConceptoTipo: {
        type: STRING,
        allowNull: false
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

module.exports = MovimientoConcepto;