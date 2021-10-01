const { STRING, INTEGER, CHAR } = require('sequelize');
const db = require('../config/connection');

const Domicilio = db.define('domicilio', {
    DomicilioId: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true
    },
    DomicilioCalle: {
        type: STRING(256),
        allowNull: false
    },
    DomicilioNumero: {
        type: INTEGER,
        allowNull: true
    },
    DomicilioPiso: {
        type: INTEGER,
        allowNull: true
    },
    BarrioId: {
        type: INTEGER,
        allowNull: true
    }
});

module.exports = db.model('domicilio', Domicilio);