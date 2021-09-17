const { Sequelize, UUIDV4, INTEGER, STRING, DATE } = require('sequelize');
const sequelize = new Sequelize({dialect: 'mysql', define: { freezeTableName: true}});

const UserServicio = sequelize.define('userservicio', {
    UserId: {
        type: UUIDV4
    },
    ServicioId: {
        type: INTEGER
    },
    CambioServicioFecha: {
        type: DATE
    },
    CambioServicioObservaciones: {
        type: STRING
    }
});

module.exports = sequelize.model('userservicio', UserServicio);