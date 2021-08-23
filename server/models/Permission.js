const { Sequelize, Datatypes } = require('sequelize');
const sequelize = new Sequelize({dialect: 'mysql', define: { freezeTableName: true}});

const Permission = sequelize.define('Permission', {
    PermissionId: {
        type: Datatypes.UUID,
        defaultValue: Sequelize.UUIDV1
    },
    PermissionName: {
        type: Datatypes.STRING(256),
        allowNull: false
    },
    Description: {
        type: Datatypes.STRING(256),
        allowNull: true
    }
});