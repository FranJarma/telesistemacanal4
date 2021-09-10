const { Sequelize, UUIDV4, STRING } = require('sequelize');
const sequelize = new Sequelize({dialect: 'mysql', define: { freezeTableName: true}});

const Role = sequelize.define('_role', {
    RoleId: {
        type: UUIDV4

    },
    RoleName: {
        type: STRING(256),
        allowNull: false
    },
    Description: {
        type: STRING(256),
        allowNull: true
    }
});

module.exports = sequelize.model('_role', Role);