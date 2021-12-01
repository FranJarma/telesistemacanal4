const { STRING, INTEGER, FLOAT, DATE, UUIDV4 } = require('sequelize');
const db = require('../config/connection');

const Pago = db.define('pago', {
    PagoId: {
        type: INTEGER,
        primaryKey: true
    },
    PagoSaldo: {
        type: FLOAT,
        allowNull: false
    },
    PagoRecargo: {
        type: FLOAT,
        allowNull: false
    },
    PagoTotal: {
        type: FLOAT,
        allowNull: false
    },
    PagoPeriodo: {
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
    },
    //fk
    UserId: {
        type: STRING(38),
        allowNull: false
    },
});

module.exports = db.model('pago', Pago);