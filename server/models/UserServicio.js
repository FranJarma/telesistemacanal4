const { Sequelize, UUIDV4, INTEGER } = require('sequelize');
const sequelize = new Sequelize({dialect: 'mysql', define: { freezeTableName: true}});

const UserServicio = sequelize.define('userservicio', {
    UserId: {
        type: UUIDV4
    },
    ServicioId: {
        type: INTEGER
    }
});

module.exports = sequelize.model('userservicio', UserServicio);