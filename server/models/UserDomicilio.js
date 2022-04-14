const { UUIDV4, INTEGER, STRING, DATE } = require('sequelize');
const db = require('../config/connection');

const UserDomicilio = db.define('userdomicilio', {
    UserDomicilioId: {
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
    DomicilioId: {
        type: INTEGER,
        allowNull: false
    },
    EstadoId: {
        type: INTEGER
    },
    CambioDomicilioObservaciones: {
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

module.exports = db.model('userdomicilio', UserDomicilio);