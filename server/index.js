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

//USUARIOS
app.use('/api/usuarios', require('./routes/User.js'));
//PROVINCIAS
app.use('/api/provincias', require('./routes/Provincia.js'));
//MUNICIPIOS
app.use('/api/municipios', require('./routes/Municipio.js'));
//BARRIOS
app.use('/api/barrios', require('./routes/Barrio.js'));
//SERVICIOS
app.use('/api/servicios', require('./routes/Servicio.js'));
//CONDICIONES IVA
app.use('/api/condicionesIva', require('./routes/CondicionIva.js'));
//MODELOS ONU
app.use('/api/modelosOnu', require('./routes/ModeloOnu.js'));
//PAGOS
app.use('/api/pagos', require('./routes/Pago.js'));
//DETALLES PAGOS
app.use('/api/detallesPago', require('./routes/DetallePago'));
//MEDIOS DE PAGO
app.use('/api/mediosPago', require('./routes/MedioPago.js'));
//pág principal
app.get('/', (req, res)=>{
    res.send(`Conectado a: ${process.env.DB_NAME} en puerto: ${PORT}`)
});

//arrancamos la app
app.listen(PORT, ()=>{
    console.log(`El servidor está funcionando en el puerto ${PORT}`);
});


