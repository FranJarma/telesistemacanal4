const { Sequelize, STRING, INTEGER } = require('sequelize');
const sequelize = new Sequelize({dialect: 'mysql', define: { freezeTableName: true}});

const Domicilio = sequelize.define('domicilio', {
    DomicilioId: {
        type: INTEGER,
        allowNull: false
    },
    DomicilioCalle: {
        type: STRING(256),
        allowNull: false
    },
    DomicilioNumero: {
        type: INTEGER,
        allowNull: true
    },
    DomicilioPiso: {
        type: INTEGER,
        allowNull: true
    },
    BarrioId: {
        type: INTEGER,
        allowNull: true
    }
});

module.exports = sequelize.model('domicilio', Domicilio);