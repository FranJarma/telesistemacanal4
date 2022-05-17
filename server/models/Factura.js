const { BIGINT, STRING, INTEGER, FLOAT, DATE, UUIDV4 } = require('sequelize');
const db = require('../config/connection');

const Factura = db.define('factura', {
    FacturaId: {
        type: INTEGER,
        primaryKey: true
    },
    FacturaNumeroComprobante: {
        type: BIGINT,
        allowNull: false
    },
    FacturaCodigoAutorizacion: {
        type: BIGINT,
        allowNull: false
    },
    FacturaFechaVencimientoCodigoAutorizacion: {
        type: STRING,
        allowNull: false
    },
    FacturaTipoCodigoAutorizacion: {
        type: STRING,
        allowNull: false
    },
    FacturaImporte: {
        type: FLOAT,
        allowNull: false
    },
    FacturaVersion: {
        type: INTEGER,
        allowNull: false
    },
    FacturaCuitEmisor: {
        type: BIGINT,
        allowNull: false
    },
    FacturaPuntoVenta: {
        type: STRING,
        allowNull: false
    },
    FacturaFechaEmision: {
        type: STRING,
        allowNull: true
    },
    FacturaTipoComprobante: {
        type: INTEGER,
        allowNull: true,
    },
    FacturaMoneda: {
        type: STRING,
        allowNull: true
    },
    FacturaCotizacion: {
        type: INTEGER,
        allowNull: true,
    },
    FacturaTipoDocReceptor: {
        type: INTEGER,
        allowNull: true
    },
    FacturaNroDocReceptor: {
        type: BIGINT,
        allowNull: true,
    },
    FacturaAño: {
        type: INTEGER,
        allowNull: false
    },
    FacturaMes: {
        type: INTEGER,
        allowNull: false
    },
    AbonadoId: {
        type: STRING(38),
        allowNull: false
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

module.exports = db.model('factura', Factura);