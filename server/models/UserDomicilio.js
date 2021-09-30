const { Sequelize, UUIDV4, INTEGER, STRING, DATE } = require('sequelize');
const db = require('../config/connection');

const UserDomicilio = db.define('userdomicilio', {
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

module.exports = db.model('userdomicilio', UserDomicilio);