import React, { useState, useEffect, useContext } from 'react';
import Aside from '../design/layout/Aside';
import { Button, Card, CardContent, Grid, MenuItem, TextField, Typography } from '@material-ui/core'; 
import Alert from '@material-ui/lab/Alert';
import useStyles from '../Styles';
import { DatePicker  } from '@material-ui/pickers';
import { useLocation, useHistory } from 'react-router-dom';
import AbonadoContext from '../../../context/abonados/abonadoContext';
import ProvinciaContext from '../../../context/provincias/provinciaContext';
import MunicipioContext from '../../../context/municipios/municipioContext';
import BarrioContext from '../../../context/barrios/barrioContext';
import ServicioContext from '../../../context/servicios/servicioContext';
import CondicionesIVAContext from '../../../context/condicionesIVA/condicionesIVAContext';

const CaratulaAbonado = () => {
    //Context
    const abonadosContext = useContext(AbonadoContext);
    const provinciasContext = useContext(ProvinciaContext);
    const municipiosContext = useContext(MunicipioContext);
    const barriosContext = useContext(BarrioContext);
    const serviciosContext = useContext(ServicioContext);
    const condicionesIVAContext = useContext(CondicionesIVAContext);

    const { domicilios, traerDomiciliosAbonado, crearAbonado, modificarAbonado } = abonadosContext;
    const { provincias, traerProvincias } = provinciasContext;
    const { municipios, traerMunicipiosPorProvincia } = municipiosContext;
    const { barrios, traerBarriosPorMunicipio } = barriosContext;
    const { servicios, traerServicios } = serviciosContext;
    const { condicionesIVA, traerCondicionesIVA } = condicionesIVAContext;
    const location = useLocation();
    const styles = useStyles();
    //Observables
    useEffect(() => {
        traerProvincias();
        traerMunicipiosPorProvincia(provinciaSeleccionadaId);
        traerServicios();
        traerCondicionesIVA();
        if(location.state)
        {
            setAbonadoInfo({
                id: location.state.UserId,
                nombre: location.state.FullName.split(',')[1],
                apellido: location.state.FullName.split(',')[0],
                dni: location.state.Documento,
                cuit: location.state.Cuit,
                email: location.state.Email,
                telefono: location.state.Phone
            });
            setCondicionIVASeleccionadoId(location.state.CondicionIVAId);
            setFechaNacimiento(location.state.FechaNacimiento);
            setFechaBajada(location.state.FechaBajada);
            setFechaContrato(location.state.FechaContrato);
        }
    }, [])
    //States
    const [abonadoInfo, setAbonadoInfo] = useState({
        id: null,
        nombre: null,
        apellido: null,
        dni: null,
        cuit: null,
        email: null,
        telefono: null,
        domicilioCalle: null,
        domicilioNumero: null,
        domicilioPiso: null,
    })
    const onInputChange = (e) => {
        setAbonadoInfo({
            ...abonadoInfo,
            [e.target.name] : e.target.value
        });
    }
    const { id, nombre, apellido, dni, cuit, email, telefono, domicilioCalle, domicilioNumero, domicilioPiso} = abonadoInfo;
    //seteamos en 10 para que traiga jujuy directamente
    const [provinciaSeleccionadaId, setProvinciaSeleccionadaId] = useState(10);
    //para más adelante cuando vayan a otras provincias
    /*
    const handleChangeProvinciaSeleccionada = (e) => {
        setProvinciaSeleccionadaId(e.target.value);
        setMunicipioSeleccionadoId(0);
        setBarrioSeleccionadoId(0);
        traerMunicipiosPorProvincia(e.target.value);
    }*/
    const [municipioSeleccionadoId, setMunicipioSeleccionadoId] = useState(0);
    const [barrioSeleccionadoId, setBarrioSeleccionadoId] = useState(0);
    const [servicioSeleccionadoId, setServicioSeleccionadoId] = useState(0);
    const handleChangeMunicipioSeleccionado = (e) => {
        setMunicipioSeleccionadoId(e.target.value);
        setBarrioSeleccionadoId(0);
        traerBarriosPorMunicipio(e.target.value);
    }
    const handleChangeBarrioSeleccionado = (e) => {
        setBarrioSeleccionadoId(e.target.value);
    }
    const handleChangeServicioSeleccionado = (e) => {
        setServicioSeleccionadoId(e.target.value);
    }
    const [condicionIVASeleccionadoId, setCondicionIVASeleccionadoId] = useState(0);
    const handleChangeCondicionIVASeleccionado = (e) => {
        setCondicionIVASeleccionadoId(e.target.value);
    }
    const [fechaNacimiento, setFechaNacimiento] = useState(new Date());
    const [fechaContrato, setFechaContrato] = useState(new Date());
    const [fechaBajada, setFechaBajada] = useState(new Date());

    //SUBMIT
    const onSubmitAbonado = (e) => {
        e.preventDefault();
        if(!location.state) {
            crearAbonado({
                nombre,
                apellido,
                dni,
                cuit,
                email,
                telefono,
                domicilioCalle,
                domicilioNumero,
                domicilioPiso,
                fechaNacimiento,
                fechaContrato,
                fechaBajada,
                condicionIVASeleccionadoId,
                provinciaSeleccionadaId,
                municipioSeleccionadoId,
                barrioSeleccionadoId,
                servicioSeleccionadoId
            });
        }
        else {
            modificarAbonado({
                id,
                nombre,
                apellido,
                dni,
                cuit,
                email,
                telefono,
                fechaNacimiento,
                fechaContrato,
                fechaBajada,
                condicionIVASeleccionadoId,
            });
        }
    }
    return ( 
    <>
    <Aside/>
    <form onSubmit={onSubmitAbonado}>
    <Card className={styles.cartaPrincipal}>
        <CardContent>
            <Typography variant="h1">{location.state ? `Editar abonado: ${location.state.FullName}` : "Agregar abonado"}</Typography>
            <Typography variant="h2"><i className="bx bx-user"></i> Datos del abonado</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4} lg={4} xl={4}>
                    <TextField
                    autoFocus
                    variant="outlined"
                    value={nombre}
                    name="nombre"
                    onChange={onInputChange}
                    fullWidth
                    label="Nombre">
                    </TextField>
                </Grid>
                <Grid item xs={12} md={4} lg={4} xl={4}>
                    <TextField
                    variant="outlined"
                    value={apellido}
                    name="apellido"
                    onChange={onInputChange}
                    fullWidth
                    label="Apellido">
                    </TextField>
                </Grid>
                <Grid item xs={12} md={2} lg={2} xl={2}>
                    <TextField
                    variant="outlined"
                    value={dni}
                    name="dni"
                    inputProps={{ maxLength: 8 }}
                    onChange={onInputChange}
                    fullWidth
                    label="DNI">
                    </TextField>
                </Grid>
                <Grid item xs={12} md={2} lg={2} xl={2}>
                    <TextField
                    variant="outlined"
                    value={cuit}
                    name="cuit"
                    inputProps={{ maxLength: 11 }}
                    onChange={onInputChange}
                    fullWidth
                    label="CUIT"
                    >
                    </TextField>
                </Grid>
                <Grid item xs={12} md={3} lg={3} xl={3}>
                    <TextField
                    variant="outlined"
                    value={condicionIVASeleccionadoId}
                    onChange={handleChangeCondicionIVASeleccionado}
                    fullWidth
                    select
                    label="Condición IVA"
                    >
                    {condicionesIVA.map((condicionIVA)=>(
                        <MenuItem key={condicionIVA.CondicionIVAId} value={condicionIVA.CondicionIVAId}>{condicionIVA.CondicionIVADescripcion}</MenuItem>
                    ))}
                    </TextField>
                </Grid>
                <Grid item xs={12} md={3} lg={3} xl={3}>
                    <TextField
                    variant="outlined"
                    value={email}
                    name="email"
                    onChange={onInputChange}
                    fullWidth
                    label="Email"
                    >
                    </TextField>
                </Grid>
                <Grid item xs={12} md={3} lg={3} xl={3}>
                    <DatePicker 
                    inputVariant="outlined"
                    value={fechaNacimiento}
                    onChange={(fecha)=>setFechaNacimiento(fecha)}
                    disableFuture
                    format="dd/MM/yyyy"
                    fullWidth
                    label="Fecha de nacimiento"
                    openTo="year"
                    views={["year", "month", "date"]}>
                    </DatePicker >
                </Grid>
                <Grid item xs={12} md={3} lg={3} xl={3}>
                    <TextField
                    variant="outlined"
                    value={telefono}
                    name="telefono"
                    onChange={onInputChange}
                    type="number"
                    fullWidth
                    label="N° Teléfono">
                    </TextField>
                </Grid>
                {!location.state ?
                <>
                <Grid item xs={12} md={6} lg={6} xl={6}>
                    <TextField
                    variant="filled"
                    disabled
                    value={provinciaSeleccionadaId}
                    label="Provincia"
                    fullWidth
                    select
                    >
                    {provincias.map((provincia)=>(
                        <MenuItem key={provincia.ProvinciaId} value={provincia.ProvinciaId}>{provincia.ProvinciaNombre}</MenuItem>
                    ))}
                    </TextField>
                </Grid>
                <Grid item xs={12} md={6} lg={6} xl={6}>
                    <TextField
                    variant = "outlined"
                    onChange={handleChangeMunicipioSeleccionado}
                    value={municipioSeleccionadoId}
                    label="Municipio"
                    fullWidth
                    select
                    >
                    {municipios.length > 0 ? municipios.map((municipio)=>(
                        <MenuItem key={municipio.MunicipioId} value={municipio.MunicipioId}>{municipio.MunicipioNombre}</MenuItem>
                    )): <MenuItem disabled>No se encontraron municipios</MenuItem>}
                    </TextField>
                </Grid>
                </>
                : "" }
            </Grid>
            {!location.state ?
            <>
            <Typography variant="h2"><i className="bx bx-home"></i> Datos del domicilio de instalación</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4} lg={4} xl={4}>
                <TextField
                    variant = "outlined"
                    onChange={handleChangeBarrioSeleccionado}
                    value={barrioSeleccionadoId}
                    label="Barrio"
                    fullWidth
                    select
                    >
                    {barrios.length > 0 ? barrios.map((barrio)=>(
                        <MenuItem key={barrio.BarrioId} value={barrio.BarrioId}>{barrio.BarrioNombre}</MenuItem>
                    )): <MenuItem disabled>No se encontraron barrios</MenuItem>}
                    </TextField>
                </Grid>
                <Grid item xs={12} md={4} lg={4} xl={4}>
                    <TextField
                    variant = "outlined"
                    value={domicilioCalle}
                    name="domicilioCalle"
                    onChange={onInputChange}
                    fullWidth
                    label="Calle">
                    </TextField>
                </Grid>
                <Grid item xs={12} md={2} lg={2}>
                    <TextField
                    variant = "outlined"
                    value={domicilioNumero}
                    name="domicilioNumero"
                    onChange={onInputChange}
                    type="number"
                    fullWidth
                    label="Número">
                    </TextField>
                </Grid>
                <Grid item xs={12} md={2} lg={2}>
                    <TextField
                    variant = "outlined"
                    value={domicilioPiso}
                    name="domicilioPiso"
                    onChange={onInputChange}
                    type="number"
                    fullWidth
                    label="Piso">
                    </TextField>
                </Grid>
            </Grid>
            </>
            :""}
            <Typography  variant="h2"><i className="bx bx-plug"></i> Datos del servicio a contratar</Typography>
            <Grid container spacing={3}>
            {!location.state ?
            <>
                <Grid item xs={12} md={4} lg={4} xl={4}>
                    <TextField
                    variant = "outlined"
                    value={servicioSeleccionadoId}
                    onChange={handleChangeServicioSeleccionado}
                    label="Tipo de servicio"
                    fullWidth
                    select
                    >
                    {servicios.map((servicio)=>(
                        <MenuItem key={servicio.ServicioId} value={servicio.ServicioId}>{servicio.ServicioNombre}</MenuItem>
                    ))}
                    </TextField>
                </Grid>
            </>
            : "" }
                <Grid item xs={12} md={4} lg={4} xl={4}>
                    <DatePicker 
                    inputVariant="outlined"
                    value={fechaContrato}
                    onChange={(fecha)=>setFechaContrato(fecha)}
                    format="dd/MM/yyyy"
                    fullWidth
                    label="Fecha de Contrato"
                    >
                    </DatePicker >
                </Grid>
                <Grid item xs={12} md={4} lg={4} xl={4}>
                    <DatePicker 
                    inputVariant="outlined"
                    value={fechaBajada}
                    onChange={(fecha)=>setFechaBajada(fecha)}
                    format="dd/MM/yyyy"
                    fullWidth
                    label="Fecha de Bajada"
                    >
                    </DatePicker >
                </Grid>
            </Grid>
            {servicioSeleccionadoId !== 1 ?
            <>
            <Typography variant="h2"><i className='bx bx-broadcast'></i> Datos de ONU</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={3} lg={3}>
                    <TextField
                    variant="outlined"
                    value={servicioSeleccionadoId}
                    onChange={handleChangeServicioSeleccionado}
                    label="Tipo de ONU"
                    fullWidth
                    select
                    disabled
                    >
                    {servicios.map((servicio)=>(
                        <MenuItem key={servicio.ServicioId} value={servicio.ServicioId}>{servicio.ServicioNombre}</MenuItem>
                    ))}
                    </TextField>
                </Grid>
                <Grid item xs={12} md={3} lg={3} xl={3}>
                <TextField
                    variant="outlined"
                    value={servicioSeleccionadoId}
                    onChange={handleChangeServicioSeleccionado}
                    label="MAC"
                    fullWidth
                    >
                </TextField>
                </Grid>
                <Grid item xs={12} md={3} lg={3} xl={3}>
                <TextField
                    variant="outlined"
                    value={servicioSeleccionadoId}
                    onChange={handleChangeServicioSeleccionado}
                    label="Nº de serie"
                    fullWidth
                    >
                </TextField>
                </Grid>
                <Grid item xs={12} md={3} lg={3} xl={3}>
                <TextField
                    variant="outlined"
                    value={servicioSeleccionadoId}
                    onChange={handleChangeServicioSeleccionado}
                    label="Modelo"
                    fullWidth
                    >
                </TextField>
                </Grid>
            </Grid>
            </>
            : "" }
            <br/>
            {location.state ? <Alert severity="info">Para modificar todos los datos del domicilio y del servicio contratado se tiene que ir a las opciones <b>Cambio de Domicilio y Cambio de Servicio</b> respectivamente.</Alert> :""}
        </CardContent>
        <div style={{textAlign: 'center', marginBottom: '1.5rem'}}>
            <Button type="submit" startIcon={<i className={location.state ? "bx bx-edit":"bx bx-check"}></i>}
            variant="contained" color="primary">
            {location.state ? "Modificar" : "Registrar"}
        </Button>
        </div>
    </Card>
    </form>
    </>
    );
}
 
export default CaratulaAbonado;