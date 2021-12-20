const { INTEGER, DATE, UUIDV4 } = require('sequelize');
const db = require('../config/connection');

const OtTarea = db.define('ottarea', {
    OtTareaId: {
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
    TareaId: {
        type: INTEGER,
        allowNull: false
    },
    OtId: {
        type: INTEGER,
        allowNull: false
    },
});

module.exports = OtTarea;