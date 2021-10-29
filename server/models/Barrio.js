const { STRING, INTEGER } = require('sequelize');
const db = require('../config/connection');

const Barrio = db.define('barrio', {
    BarrioId: {
        type: INTEGER,
        primaryKey: true
    },
    BarrioNombre: {
        type: STRING(256),
        allowNull: false
    },
    BarrioEliminado: {
        type: INTEGER,
        defaultValue: 0
    },
    MunicipioId: {
        type: INTEGER,
        allowNull: true
    }
});

module.exports = db.model('barrio', Barrio);