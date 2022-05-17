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

//AUTH
app.use('/api/auth', require('./routes/Auth.js'));
//USUARIOS
app.use('/api/usuarios', require('./routes/User.js'));
//ROLES
app.use('/api/roles', require('./routes/Role.js'));
//PERMISOS
app.use('/api/permisos', require('./routes/Permission.js'));
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
//ONU
app.use('/api/onus', require('./routes/Onu.js'));
//MODELOS ONU
app.use('/api/modelosONU', require('./routes/ModeloOnu.js'));
//PAGOS
app.use('/api/pagos', require('./routes/Pago.js'));
//DETALLES PAGOS
app.use('/api/detallesPago', require('./routes/DetallePago'));
//MEDIOS DE PAGO
app.use('/api/mediosPago', require('./routes/MedioPago.js'));
//TAREAS
app.use('/api/tareas', require('./routes/Tarea.js'));
//OT
app.use('/api/ot', require('./routes/Ot.js'));
//MOVIMIENTOS
app.use('/api/movimientos', require('./routes/Movimiento.js'));
//CONCEPTOS
app.use('/api/conceptos', require('./routes/MovimientoConcepto.js'));
//CAJA
app.use('/api/caja', require('./routes/Caja.js'));
//FACTURAS
app.use('/api/facturas', require('./routes/Factura.js'));
//pág principal
app.get('/', (req, res)=>{
    res.send(`Conectado a: ${process.env.DB_NAME} en puerto: ${PORT}`)
});

//arrancamos la app
app.listen(PORT, ()=>{
    console.log(`El servidor está funcionando en el puerto ${PORT}`);
});


