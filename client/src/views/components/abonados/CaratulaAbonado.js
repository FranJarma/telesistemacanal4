import React, { useState, useEffect, useContext } from 'react';
import Aside from '../design/layout/Aside';
import { Button, Card, CardContent, Grid, MenuItem, TextField, Typography } from '@material-ui/core'; 
import Autocomplete from '@material-ui/lab/Autocomplete';
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

    const { errorFormulario, crearAbonado } = abonadosContext;
    const { provincias, traerProvincias } = provinciasContext;
    const { municipios, traerMunicipiosPorProvincia } = municipiosContext;
    const { barrios, traerBarriosPorMunicipio } = barriosContext;
    const { servicios, traerServicios } = serviciosContext;
    const { condicionesIVA, traerCondicionesIVA } = condicionesIVAContext;
    const location = useLocation();
    const history = useHistory();
    const styles = useStyles();
    //Observables
    useEffect(() => {
        traerProvincias();
        traerMunicipiosPorProvincia(provinciaSeleccionadaId);
        traerServicios();
        traerCondicionesIVA();
    }, [])
    //States
    const [abonadoInfo, setAbonadoInfo] = useState({
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
    const { nombre, apellido, dni, cuit, email, telefono, domicilioCalle, domicilioNumero, domicilioPiso} = abonadoInfo;
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
    const [municipioSeleccionadoId, setMunicipioSeleccionadoId] = useState(null);
    const handleChangeMunicipioSeleccionado = (e) => {
        setMunicipioSeleccionadoId(e.target.value);
        setBarrioSeleccionadoId(null);
        traerBarriosPorMunicipio(e.target.value);
    }
    const [barrioSeleccionadoId, setBarrioSeleccionadoId] = useState(null);
    const [servicioSeleccionadoId, setServicioSeleccionadoId] = useState(null);
    const handleChangeServicioSeleccionado = (e) => {
        setServicioSeleccionadoId(e.target.value);
    }
    const [condicionIVASeleccionadoId, setCondicionIVASeleccionadoId] = useState(null);
    const handleChangeCondicionIVASeleccionado = (e) => {
        setCondicionIVASeleccionadoId(e.target.value);
    }
    const [fechaNacimiento, setFechaNacimiento] = useState(new Date());
    const [fechaContrato, setFechaContrato] = useState(new Date());
    const [fechaBajada, setFechaBajada] = useState(new Date());

    //SUBMIT
    const onSubmitAbonado = (e) => {
        e.preventDefault();
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
        if(errorFormulario === '')
        setTimeout(()=>{
            history.push('/abonados-activos');
        },1000) 
    }
    return ( 
    <>
    <Aside/>
    <form onSubmit={onSubmitAbonado}>
    <Card className={styles.cartaPrincipal}>
        <CardContent>
            <Typography variant="h1">{location.state ? `Editar abonado: ${location.state.nombreCompleto}` : "Agregar abonado"}</Typography>
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
                <Grid item xs={12} md={6} lg={6} xl={6}>
                    <TextField
                    variant="outlined"
                    disabled
                    //onChange={handleChangeProvinciaSeleccionada}
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
                    variant="outlined"
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
            </Grid>
            <Typography variant="h2"><i className="bx bx-home"></i> Datos del domicilio de instalación</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4} lg={4} xl={4}>
                    <Autocomplete
                    variant="outlined"
                    label="Barrio"
                    noOptionsText= "No se encontraron barrios"
                    fullWidth
                    options={barrios}
                    key={municipioSeleccionadoId}
                    onChange={(event, value) => value ? setBarrioSeleccionadoId(value.BarrioId) : setBarrioSeleccionadoId(0)}
                    getOptionLabel={(option) => option.BarrioNombre}
                    renderInput={(params) => <TextField {...params} label="Barrio" variant="outlined" />}
                    >
                    </Autocomplete>
                </Grid>
                <Grid item xs={12} md={4} lg={4} xl={4}>
                    <TextField
                    variant="outlined"
                    value={domicilioCalle}
                    name="domicilioCalle"
                    onChange={onInputChange}
                    fullWidth
                    label="Calle">
                    </TextField>
                </Grid>
                <Grid item xs={12} md={2} lg={2}>
                    <TextField
                    variant="outlined"
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
                    variant="outlined"
                    value={domicilioPiso}
                    name="domicilioPiso"
                    onChange={onInputChange}
                    type="number"
                    fullWidth
                    label="Piso">
                    </TextField>
                </Grid>
            </Grid>
            <Typography variant="h2"><i className="bx bx-plug"></i> Datos del servicio a contratar</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={3} lg={3}>
                    <TextField
                    variant="outlined"
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
                <Grid item xs={12} md={3} lg={3} xl={3}>
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
                <Grid item xs={12} md={3} lg={3} xl={3}>
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