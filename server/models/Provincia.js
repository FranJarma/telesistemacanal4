const { Sequelize, STRING } = require('sequelize');
const sequelize = new Sequelize({dialect: 'mysql', define: { freezeTableName: true}});

const Provincia = sequelize.define('provincia', {
    NombreProvincia: {
        type: STRING(256),
        allowNull: false
    },
    SiglaProvincia: {
        type: STRING(256),
        allowNull: true
    }
});

module.exports = sequelize.model('provincia', Provincia);