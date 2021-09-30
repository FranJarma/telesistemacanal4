const { Sequelize, UUIDV4, DATE, NOW, STRING, INTEGER, BIGINT,  } = require('sequelize');
const db = require('../config/connection');

const User = db.define('_user', {
    UserId: {
        type: UUIDV4,
        primaryKey: true
    },
    UserName: {
        type: STRING(256),
        unique: true,
        allowNull: true,
    },
    FullName: {
        type: STRING(256),
        allowNull: false
    },
    Password: {
        type: STRING(256),
        allowNull: true,
    },
    Documento: {
        type: INTEGER,
        allowNull: false
    },
    Cuit: {
        type: BIGINT,
        allowNull: false
    },
    Email: {
        type: STRING(256),
        unique: true,
        allowNull: false
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
    Phone: {
        type: BIGINT,
        allowNull: false
    },
    FailedPasswordCount: {
        type: INTEGER,
        defaultValue: 0
    },
    IsActive: {
        type: INTEGER,
        defaultValue: 1
    },
    IsLocked: {
        type: INTEGER,
        defaultValue: 0
    },
    IsTestUser: {
        type: INTEGER,
        defaultValue: 1
    },
    LastLoginDate: {
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
    deletedAt: {
        type: DATE,
        allowNull: true,
    },
    deletedBy: {
        type: UUIDV4,
        allowNull: true,
    },
    updatedAt: {
        type: DATE,
        allowNull: true,
    },
    updatedBy: {
        type: UUIDV4,
        allowNull: true,
    },
    //Columnas Relacionadas por fk
    CondicionIVAId: {
        type: INTEGER,
        allowNull: true
    },
    OnuId: {
        type: INTEGER,
        allowNull: true
    }
});

module.exports = User;