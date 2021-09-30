const { Sequelize, STRING } = require('sequelize');
const db = require('../config/connection');

const Barrio = db.define('barrio', {
    NombreBarrio: {
        type: STRING(256),
        allowNull: false
    },
    SiglaProvincia: {
        type: STRING(256),
        allowNull: true
    }
});

module.exports = db.model('barrio', Barrio);