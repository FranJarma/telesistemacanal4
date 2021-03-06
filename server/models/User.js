const { UUIDV4, DATE, STRING, INTEGER, BIGINT, BOOLEAN, FLOAT  } = require('sequelize');
const db = require('../config/connection');

const User = db.define('_user', {
    UserId: {
        type: UUIDV4,
        primaryKey: true
    },
    AbonadoNumero: {
        type: INTEGER
    },
    NombreUsuario: {
        type: STRING(256),
        unique: true,
        allowNull: true,
    },
    Nombre: {
        type: STRING(256),
        allowNull: false
    },
    Apellido: {
        type: STRING(256),
        allowNull: false
    },
    Contraseña: {
        type: STRING(256),
        allowNull: true,
    },
    Documento: {
        type: BIGINT,
        allowNull: false
    },
    Cuit: {
        type: BIGINT,
        allowNull: true
    },
    Email: {
        type: STRING(256),
        unique: true,
        allowNull: true
    },
    FechaBajada: {
        type: DATE,
        allowNull: true
    },
    FechaContrato: {
        type: DATE,
        allowNull: true
    },
    FechaNacimiento: {
        type: DATE,
        allowNull: true
    },
    FechaVencimientoServicio: {
        type: DATE,
        allowNull: true
    },
    Telefono: {
        type: BIGINT,
        allowNull: true
    },
    IntentosFallidos: {
        type: INTEGER,
        defaultValue: 0
    },
    EsUsuarioDePrueba: {
        type: BOOLEAN
    },
    EsUsuarioDeSistema: {
        type: BOOLEAN
    },
    UltimoInicioDeSesion: {
        type: DATE,
        allowNull: true
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
    //Columnas Relacionadas por fk
    CondicionIvaId: {
        type: INTEGER,
        allowNull: true
    },
    OnuId: {
        type: INTEGER,
        allowNull: true
    },
    ServicioId: {
        type: INTEGER,
        allowNull: true
    },
    DomicilioId: {
        type: INTEGER,
        allowNull: true
    },
    EstadoId: {
        type: INTEGER,
        allowNull: false
    }
});

module.exports = User;