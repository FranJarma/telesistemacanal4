const { INTEGER, DATE, UUIDV4, STRING, FLOAT } = require('sequelize');
const db = require('../config/connection');

const Tarea = db.define('tarea', {
    TareaId: {
        type: INTEGER,
        primaryKey: true
    },
    TareaNombre: {
        type: STRING,
        allowNull: false
    },
    TareaDescripcion: {
        type: STRING,
    },
    TareaPrecioUnitario: {
        type: FLOAT,
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

module.exports = Tarea;