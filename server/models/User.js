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
    Email: {
        type: STRING(256),
        unique: true,
        allowNull: true
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
    IsLocked: {
        type: INTEGER,
        defaultValue: 0
    },
    IsActive: {
        type: INTEGER,
        defaultValue: 1
    },
    IsTestUser: {
        type: INTEGER,
        defaultValue: 0
    },
    Phone: {
        type: STRING(256),
        allowNull: true
    },
    FailedPasswordCount: {
        type: INTEGER,
        defaultValue: 0
    },
    _fechaCarga: {
        type: DATE,
        allowNull: false,
        defaultValue: NOW
    },
    _usuarioCarga: {
        type: UUID,
        allowNull: false
        //agregar usuario de carga
    },
    _fechaDesactivado: {
        type: DATE,
        allowNull: true,
    },
    _usuarioDesactivado: {
        type: UUID,
        allowNull: true
    },
    _fechaModificacion: {
        type: DATE,
        allowNull: true
    },
    _usuarioModificacion: {
        type: UUID,
        allowNull: true
    },
    //Columnas Relacionadas por fk
    ProvinciaId: {
        type: INTEGER,
        allowNull: false
    },
    DepartamentoId: {
        type: INTEGER,
        allowNull: false
    },
    MunicipioId: {
        type: INTEGER,
        allowNull: false
    },
});

module.exports = User;