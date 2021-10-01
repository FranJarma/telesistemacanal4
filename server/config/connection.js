const { Sequelize } = require('sequelize');
const fs  = require('fs');
require('dotenv').config({path: 'variables.env'});
const db = new Sequelize({
  define: {
    freezeTableName: true,
    timestamps: false,
  },
  username: process.env.DB_USER,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dialect: 'mysql'
})
module.exports = db;