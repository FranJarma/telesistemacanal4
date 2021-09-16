const { Sequelize, STRING } = require('sequelize');
const sequelize = new Sequelize({dialect: 'mysql', define: { freezeTableName: true}});

const Barrio = sequelize.define('barrio', {
    NombreBarrio: {
        type: STRING(256),
        allowNull: false
    },
    SiglaProvincia: {
        type: STRING(256),
        allowNull: true
    }
});

module.exports = sequelize.model('barrio', Barrio);