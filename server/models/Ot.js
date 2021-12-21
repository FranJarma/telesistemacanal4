const { INTEGER, DATE, UUIDV4, STRING, TIME, CHAR } = require('sequelize');
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
    OtFechaRealizacion: {
        type: DATE,
    },
    OtHoraInicio: {
        type: TIME,
    },
    OtHoraFinalizacion: {
        type: TIME,
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
        type: STRING,
    },
    AbonadoId: {
        type: CHAR
    },
    EstadoId: {
        type: INTEGER
    }
});

module.exports = Ot;