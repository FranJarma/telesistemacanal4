const { INTEGER, DATE, UUIDV4 } = require('sequelize');
const db = require('../config/connection');

const TecnicoTarea = db.define('tecnicotarea', {
    TecnicoTareaId: {
        type: INTEGER,
        primaryKey: true
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
    TecnicoId: {
        type: DATE,
        allowNull: false
    },
    TareaId: {
        type: DATE,
        allowNull: false
    },
});

module.exports = TecnicoTarea;