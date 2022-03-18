const { STRING, INTEGER, FLOAT, DATE, UUIDV4 } = require('sequelize');
const db = require('../config/connection');

const Servicio = db.define('servicio', {
    ServicioId: {
        type: INTEGER,
        primaryKey: true
    },
    ServicioNombre: {
        type: STRING(256),
        unique: true,
        allowNull: true,
    },
    ServicioPrecioUnitario: {
        type: FLOAT,
        allowNull: false
    },
    ServicioMultiplicadorPrimerMes: {
        type: FLOAT,
        allowNull: false
    },
    ServicioBonificacionPagoSeisMeses: {
        type: FLOAT,
        allowNull: false
    },
    ServicioInscripcion: {
        type: FLOAT,
        allowNull: false
    },
    ServicioDescripcion: {
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

module.exports = Servicio;