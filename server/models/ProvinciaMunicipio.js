const { INTEGER, UUIDV4, DATE } = require('sequelize');
const db = require('../config/connection');

const ProvinciaMunicipio = db.define('provinciamunicipio', {
    ProvinciaMunicipioId: {
        type: INTEGER,
        primaryKey: true
    },
    ProvinciaId: {
        type: INTEGER,
        allowNull: false
    },
    MunicipioId: {
        type: INTEGER,
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

module.exports = db.model('provinciamunicipio', ProvinciaMunicipio);