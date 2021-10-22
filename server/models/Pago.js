const { STRING, INTEGER, FLOAT, DATE } = require('sequelize');
const db = require('../config/connection');

const Pago = db.define('pago', {
    PagoId: {
        type: INTEGER,
        primaryKey: true
    },
    PagoSaldo: {
        type: FLOAT,
        allowNull: false
    },
    PagoRecargo: {
        type: FLOAT,
        allowNull: false
    },
    PagoTotal: {
        type: FLOAT,
        allowNull: false
    },
    PagoPeriodo: {
        type: STRING,
        allowNull: false
    },
    //fk
    UserId: {
        type: STRING(38),
        allowNull: false
    },
});

module.exports = db.model('pago', Pago);