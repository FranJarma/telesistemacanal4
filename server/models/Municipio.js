const { Sequelize, STRING } = require('sequelize');
const sequelize = new Sequelize({dialect: 'mysql', define: { freezeTableName: true}});

const Municipio = sequelize.define('municipio', {
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

module.exports = sequelize.model('municipio', Municipio);