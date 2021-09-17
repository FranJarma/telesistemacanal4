const { Sequelize, UUIDV4, INTEGER, STRING, DATE } = require('sequelize');
const sequelize = new Sequelize({dialect: 'mysql', define: { freezeTableName: true}});

const UserDomicilio = sequelize.define('userdomicilio', {
    UserId: {
        type: UUIDV4
    },
    DomicilioId: {
        type: INTEGER
    },
    CambioDomicilioFecha: {
        type: DATE
    },
    CambioDomicilioObservaciones: {
        type: STRING
    }
});

module.exports = sequelize.model('userdomicilio', UserDomicilio);