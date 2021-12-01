const { STRING, INTEGER, DATE, UUIDV4 } = require('sequelize');
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
    BarrioId: {
        type: INTEGER,
        allowNull: true
    }
});

module.exports = db.model('domicilio', Domicilio);