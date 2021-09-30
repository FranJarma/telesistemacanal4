const { Sequelize } = require('sequelize');
const fs  = require('fs');
require('dotenv').config({path: 'variables.env'});
const db = new Sequelize({
  define: {
    freezeTableName: true
  },
  username: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dialect: 'mysql'
})
module.exports = db;