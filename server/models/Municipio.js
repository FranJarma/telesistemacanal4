const { Sequelize, STRING } = require('sequelize');
const db = require('../config/connection');

const Municipio = db.define('municipio', {
    MunicipioNombre: {
        type: STRING(256),
        allowNull: false
    },
    MunicipioSigla: {
        type: STRING(256),
        allowNull: true
    },
    MunicipioCodigoPostal: {
        type: STRING(256),
        allowNull: true
    }
});

module.exports = db.model('municipio', Municipio);