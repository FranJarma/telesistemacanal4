const { STRING, INTEGER } = require('sequelize');
const db = require('../config/connection');

const MedioPago = db.define('mediopago', {
    MedioPagoId: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true
    },
    MedioPagoNombre: {
        type: STRING(256),
        allowNull: false
    },
    MedioPagoDescripcion: {
        type: STRING(256),
        allowNull: false
    }
});

module.exports = db.model('mediopago', MedioPago);