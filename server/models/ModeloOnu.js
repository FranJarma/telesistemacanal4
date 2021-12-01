const { DATE, STRING, INTEGER, UUIDV4 } = require('sequelize');
const db = require('../config/connection');

const ModeloOnu = db.define('modeloonu', {
    ModeloOnuId: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true
    },
    ModeloOnuNombre: {
        type: STRING(256),
        allowNull: false
    },
    ModeloOnuDescripcion: {
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
    }
});

module.exports = db.model('modeloonu', ModeloOnu);