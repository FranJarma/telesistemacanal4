const { Sequelize, STRING } = require('sequelize');
const db = require('../config/connection');

const Provincia = db.define('provincia', {
    NombreProvincia: {
        type: STRING(256),
        allowNull: false
    },
    SiglaProvincia: {
        type: STRING(256),
        allowNull: true
    }
});

module.exports = db.model('provincia', Provincia);