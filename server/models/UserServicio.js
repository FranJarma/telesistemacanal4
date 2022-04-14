const { UUIDV4, INTEGER, STRING, DATE } = require('sequelize');
const db = require('../config/connection');

const UserServicio = db.define('userservicio', {
    UserServicioId: {
        type: INTEGER,
        primaryKey: true
    },
    UserId: {
        type: UUIDV4,
        allowNull: false
    },
    OtId: {
        type: INTEGER,
        allowNull: false
    },
    ServicioId: {
        type: INTEGER,
        allowNull: false
    },
    OnuId: {
        type: INTEGER
    },
    CambioServicioObservaciones: {
        type: STRING
    },
    createdAt: {
        type: DATE,
        allowNull: true,
    },
    createdBy: {
        type: UUIDV4,
        allowNull: true
    }
});

module.exports = db.model('userservicio', UserServicio);