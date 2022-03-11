const { STRING, INTEGER, DATE, UUIDV4 } = require('sequelize');
const db = require('../config/connection');

const Onu = db.define('onu', {
    OnuId: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true
    },
    OnuSerie: {
        type: STRING(256),
        allowNull: false
    },
    OnuMac: {
        type: STRING(256),
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
    ServicioId: {
        type: INTEGER,
        allowNull: false
    },
    //fk
    ModeloOnuId: {
        type: INTEGER,
        allowNull: false
    },
    EstadoId: {
        type: INTEGER,
        allowNull: true
    }
});

module.exports = db.model('onu', Onu);