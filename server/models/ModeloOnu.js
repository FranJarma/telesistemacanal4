const { DATE, STRING, INTEGER } = require('sequelize');
const db = require('../config/connection');

const ModeloOnu = db.define('modeloonu', {
    ModeloOnuId: {
        type: INTEGER,
        allowNull: false
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
        type: DATE
    },
    updatedAt: {
        type: DATE
    }
});

module.exports = db.model('modeloonu', ModeloOnu);