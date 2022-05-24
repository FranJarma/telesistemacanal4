const { INTEGER, DATE, UUIDV4 } = require('sequelize');
const db = require('../config/connection');

const Recibo = db.define('recibo', {
    ReciboId: {
        type: INTEGER,
        primaryKey: true
    },
    ReciboImporte: {
        type: INTEGER,
        primaryKey: true
    },
    createdAt: {
        type: DATE,
        allowNull: true,
    },
    createdBy: {
        type: UUIDV4,
        allowNull: true
    }
});

module.exports = db.model('recibo', Recibo);