const { Sequelize } = require('sequelize');
const fs  = require('fs');
require('dotenv').config({path: 'variables.env'});
const db = new Sequelize({
  define: {
    freezeTableName: true
  },
  host: process.env.DB_host,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dialect: 'mysql'
})
module.exports = db;