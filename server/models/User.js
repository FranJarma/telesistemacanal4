const { Sequelize, DATE, NOW, UUID, STRING, INTEGER } = require('sequelize');
const db = require('../config/connection');

const User = db.define('_user', {
    UserId: {
        type: UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV1
    },
    UserName: {
        type: STRING(256),
        unique: true,
        allowNull: false,
    },
    Name: {
        type: STRING(256),
        allowNull: false
    },
    LastName: {
        type: STRING(256),
        allowNull: false
    },
    FullName: {
        type: STRING(256),
        allowNull: false,
    },
    Password: {
        type: STRING(256),
        allowNull: true
    },
    Documento: {
        type: INTEGER,
        allowNull: true
    },
    Domicilio: {
        type: STRING(256),
        allowNull: true
    },
    Email: {
        type: STRING(256),
        unique: true,
        allowNull: true
    },
    FechaNacimiento: {
        type: DATE,
        allowNull: false,
        defaultValue: NOW
    },
    Phone: {
        type: STRING(256),
        allowNull: true
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
        defaultValue: 0
    },
    LastLoginDate: {
        type: DATE,
        allowNull: false,
        defaultValue: NOW
    },
    createdAt: {
        type: DATE,
        allowNull: false,
        defaultValue: NOW
    },
    createdBy: {
        type: UUID,
        allowNull: false
        //agregar usuario de carga
    },
    deactivateAt: {
        type: DATE,
        allowNull: true,
    },
    deactivateBy: {
        type: UUID,
        allowNull: true
    },
    updatedAt: {
        type: DATE,
        allowNull: true
    },
    updatedBy: {
        type: UUID,
        allowNull: true
    },
    //Columnas Relacionadas por fk
    BarrioId: {
        type: INTEGER,
        allowNull: false
    },
    ProvinciaId: {
        type: INTEGER,
        allowNull: false
    },
    MunicipioId: {
        type: INTEGER,
        allowNull: false
    },
});

module.exports = User;