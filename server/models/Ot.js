const { INTEGER, DATE, UUIDV4, STRING, CHAR } = require('sequelize');
const db = require('../config/connection');

const Ot = db.define('ot', {
    OtId: {
        type: INTEGER,
        primaryKey: true
    },
    OtFechaPrevistaVisita: {
        type: DATE,
        allowNull: false
    },
    OtEsPrimeraBajada: {
        type: INTEGER
    },
    OtFechaInicio: {
        type: DATE,
    },
    OtFechaFinalizacion: {
        type: DATE,
    },
    OtObservacionesResponsableEmision: {
        type: STRING
    },
    OtObservacionesResponsableEjecucion: {
        type: STRING
    },
    OtRetiraOnu: {
        type: INTEGER
    },
    OtRetiraCable: {
        type: INTEGER
    },
    OtPrimeraVisita: {
        type: DATE
    },
    OtSegundaVisita: {
        type: DATE
    },
    OtTerceraVisita: {
        type: DATE
    },
    OtCuartaVisita: {
        type: DATE
    },
    OtResponsableEjecucion: {
        type: UUIDV4,
        allowNull: false
    },
    createdAt: {
        type: DATE,
        allowNull: true,
    },
    createdBy: {
        type: UUIDV4,
        allowNull: true
    },
    updatedAt: {
        type: DATE,
        allowNull: true,
    },
    updatedBy: {
        type: UUIDV4,
        allowNull: true
    },
    deletedAt: {
        type: DATE,
        allowNull: true,
    },
    deletedBy: {
        type: UUIDV4,
        allowNull: true
    },
    NuevoDomicilioId: {
        type: INTEGER,
    },
    NuevoServicioId: {
        type: INTEGER,
    },
    AbonadoId: {
        type: CHAR,
        allowNull: false
    },
    EstadoId: {
        type: INTEGER
    }
});

module.exports = Ot;