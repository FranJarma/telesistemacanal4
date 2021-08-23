const express = require('express');
const db = require('./config/connection');
const cors = require('cors');
//creamos el server

const app = express();
db.authenticate();
const PORT = process.env.PORT || 4000;

app.use(express.json({ extended: true}));

app.use(cors());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});
//pág principal
app.get('/', (req, res)=>{
    res.send(`Conectado a: ${process.env.DB_NAME} en puerto: ${PORT}`)
});

//arrancamos la app
app.listen(PORT, ()=>{
    console.log(`El servidor está funcionando en el puerto ${PORT}`);
});

//ABONADOS
app.use('/api/abonados', require('./routes/User'));
