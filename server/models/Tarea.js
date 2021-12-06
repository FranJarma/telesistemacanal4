const { INTEGER, DATE, UUIDV4 } = require('sequelize');
const db = require('../config/connection');

const Tarea = db.define('tarea', {
    TareaId: {
        type: INTEGER,
        primaryKey: true
    },
    FechaEstimadaTarea: {
        type: DATE,
        allowNull: false
    },
    FechaRealizacionTarea: {
        type: DATE,
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
    EstadoId: {
        type: INTEGER,
    },
    TipoTareaId: {
        type: INTEGER,
    },
    DomicilioId: {
        type: INTEGER
    }
});

module.exports = Tarea;