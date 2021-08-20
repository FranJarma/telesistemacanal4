const express = require('express');
const conectarDB = require('./config/db');

//creamos el server

const app = express();
conectarDB();
const PORT = process.env.PORT || 4000;

//pág principal
app.get('/', (req, res)=>{
    res.send('Hola mundo')
});

//arrancamos la app
app.listen(PORT, ()=>{
    console.log(`El servidor está funcionando en el puerto ${PORT}`);
});