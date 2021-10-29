const { STRING, INTEGER } = require('sequelize');
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
    MunicipioEliminado: {
        type: INTEGER,
        defaultValue: 0
    },
});

module.exports = db.model('municipio', Municipio);