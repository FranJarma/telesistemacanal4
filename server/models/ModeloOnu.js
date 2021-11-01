const { DATE, STRING, INTEGER } = require('sequelize');
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
    ModeloOnuEliminado: {
        type: INTEGER,
        defaultValue: 0
    }
});

module.exports = db.model('modeloonu', ModeloOnu);