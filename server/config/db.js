const mysql = require('mysql');
require('dotenv').config({path: 'variables.env'});

const conectarBD = async () => {
  try {
    let connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    await connection.connect();
    console.log('Conectado a la bd!');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
  
module.exports = conectarBD;