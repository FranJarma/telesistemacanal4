const { Sequelize, UUIDV4 } = require('sequelize');
const sequelize = new Sequelize({dialect: 'mysql', define: { freezeTableName: true}});

const UserRole = sequelize.define('_userrole', {
    UserId: {
        type: UUIDV4
    },
    RoleId: {
        type: UUIDV4
    }
});

module.exports = sequelize.model('_userrole', UserRole);