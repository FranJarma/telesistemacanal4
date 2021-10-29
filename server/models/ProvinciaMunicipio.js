const { INTEGER } = require('sequelize');
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
    }
});

module.exports = db.model('provinciamunicipio', ProvinciaMunicipio);