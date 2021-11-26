const { STRING, INTEGER, DATE, UUIDV4 } = require('sequelize');
const db = require('../config/connection');

const Municipio = db.define('municipio', {
    MunicipioId: {
        type: INTEGER,
        primaryKey: true
    },
    MunicipioNombre: {
        type: STRING(256),
        allowNull: false,
    },
    MunicipioSigla: {
        type: STRING(256),
        allowNull: true
    },
    MunicipioCodigoPostal: {
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

module.exports = db.model('municipio', Municipio);