const { Sequelize, UUID } = require('sequelize');
const sequelize = new Sequelize({dialect: 'mysql', define: { freezeTableName: true}});

const UserRole = sequelize.define('_userrole', {
    UserId: {
        type: UUID
    },
    RoleId: {
        type: UUID
    }
});

module.exports = sequelize.model('_userrole', UserRole);