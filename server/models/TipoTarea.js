const { INTEGER, DATE, UUIDV4, STRING, FLOAT } = require('sequelize');
const db = require('../config/connection');

const TipoTarea = db.define('tipotarea', {
    TipoTareaId: {
        type: INTEGER,
        primaryKey: true
    },
    TipoTareaNombre: {
        type: STRING,
        allowNull: false
    },
    TipoTareaDescripcion: {
        type: STRING,
        allowNull: false
    },
    TipoTareaPrecioUnitario: {
        type: FLOAT
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

module.exports = TipoTarea;