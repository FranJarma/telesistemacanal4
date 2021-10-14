const { STRING, INTEGER, FLOAT } = require('sequelize');
const db = require('../config/connection');

const Pago = db.define('pago', {
    PagoId: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true
    },
    PagoSaldo: {
        type: FLOAT,
        allowNull: false
    },
    PagoPeriodo: {
        type: DATE,
        allowNull: false
    },
    //fk
    UserId: {
        type: STRING(38),
        allowNull: false
    },
});

module.exports = db.model('pago', Pago);