const { STRING, INTEGER, FLOAT, DATE, UUIDV4 } = require('sequelize');
const db = require('../config/connection');

const Factura = db.define('factura', {
    FacturaId: {
        type: INTEGER,
        primaryKey: true
    },
    FacturaNumeroComprobante: {
        type: FLOAT,
        allowNull: true
    },
    FacturaCae: {
        type: FLOAT,
        allowNull: true
    },
    FacturaImporte: {
        type: FLOAT,
        allowNull: false
    },
    FacturaCodAut: {
        type: INTEGER,
        allowNull: false
    },
    FacturaPuntoVenta: {
        type: INTEGER,
        allowNull: false
    },
    FacturaFechaEmision: {
        type: STRING,
        allowNull: true
    },
    FacturaTipoComprobante: {
        type: DATE,
        allowNull: true,
    },
    FacturaMoneda: {
        type: UUIDV4,
        allowNull: true
    },
    FacturaCotizacion: {
        type: DATE,
        allowNull: true,
    },
    FacturaTipoDocReceptor: {
        type: UUIDV4,
        allowNull: true
    },
    FacturaNroDocReceptor: {
        type: DATE,
        allowNull: true,
    }
});

module.exports = db.model('factura', Factura);