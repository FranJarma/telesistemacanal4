const { STRING, INTEGER } = require('sequelize');
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
    OnuEliminada: {
        type: INTEGER,
        defaultValue: 0
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
});

module.exports = db.model('onu', Onu);