import React, { useState, useEffect, useContext } from 'react';
import Aside from '../design/layout/Aside';
import { Button, Card, CardContent, Grid, MenuItem, TextField, Typography } from '@material-ui/core'; 
import Autocomplete from '@material-ui/lab/Autocomplete';
import useStyles from './../Styles';
import { DatePicker } from '@material-ui/pickers';
import { useLocation } from 'react-router-dom';
import clienteAxios from './../../../config/axios';
import ProvinciaContext from './../../../context/provincias/provinciaContext';
import MunicipioContext from './../../../context/municipios/municipioContext';
import BarrioContext from './../../../context/barrios/barrioContext';
import ServicioContext from './../../../context/servicios/servicioContext';

const CaratulaAbonado = () => {
    const provinciasContext = useContext(ProvinciaContext);
    const municipiosContext = useContext(MunicipioContext);
    const barrioContext = useContext(BarrioContext);
    const servicioContext = useContext(ServicioContext);

    const { provincias, traerProvincias } = provinciasContext;
    const { municipios, traerMunicipiosPorProvincia } = municipiosContext;
    const { barrios, traerBarriosPorMunicipio } = barrioContext;
    const { servicios, traerServicios } = servicioContext;

    const location = useLocation();
    const styles = useStyles();
    useEffect(() => {
        traerProvincias();
        traerServicios();
    }, [])

    const [provinciaSeleccionadaId, setProvinciaSeleccionadaId] = useState(0);
    const handleChangeProvinciaSeleccionada = (e) => {
        setProvinciaSeleccionadaId(e.target.value);
        setBarrioSeleccionadoId(0);
        traerMunicipiosPorProvincia(e.target.value);
    }
    const [municipioSeleccionadoId, setMunicipioSeleccionadoId] = useState(0);
    const handleChangeMunicipioSeleccionado = (e) => {
        setMunicipioSeleccionadoId(e.target.value);
        setBarrioSeleccionadoId(0);
        traerBarriosPorMunicipio(e.target.value);
    }
    const [barrioSeleccionadoId, setBarrioSeleccionadoId] = useState(0);
    const handleChangeBarrioSeleccionado = (e) => {
        setBarrioSeleccionadoId(e.target.value);
    }
    const [servicioSeleccionado, setServicioSeleccionadoId] = useState(0);
    const handleChangeServicioSeleccionado = (e) => {
        setServicioSeleccionadoId(e.target.value);
    }
    const [barrioSeleccionado, setBarrioSeleccionado] = useState('');
    const handleChangeInputBarrioSeleccionado = (e) => {
        setBarrioSeleccionado(e.target.value);
    }
    return ( 
    <>
    <Aside/>
    <Card className={styles.cartaPrincipal}>
        <CardContent>
            <Typography variant="h1">{location.state ? `Editar abonado: ${location.state.nombreCompleto}` : "Agregar abonado"}</Typography>
            <Typography variant="h2"><i className="bx bx-user"></i> Datos del abonado</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4} lg={4} xl={4}>
                    <TextField
                    autoFocus
                    variant="standard"
                    value={location.state ? location.state.nombreCompleto : ""}
                    fullWidth
                    label="Nombre">
                    </TextField>
                </Grid>
                <Grid item xs={12} md={4} lg={4} xl={4}>
                    <TextField
                    variant="standard"
                    value={location.state ? location.state.nombreCompleto : ""}
                    fullWidth
                    label="Apellido">
                    </TextField>
                </Grid>
                <Grid item xs={12} md={2} lg={2} xl={2}>
                    <TextField
                    value={location.state ? location.state.dni : ""}
                    type="number"
                    fullWidth
                    label="DNI">
                    </TextField>
                </Grid>
                <Grid item xs={12} md={2} lg={2} xl={2}>
                    <TextField
                    value={location.state ? location.state.email : ""}
                    fullWidth
                    label="CUIT"
                    >
                    </TextField>
                </Grid>
                <Grid item xs={12} md={3} lg={3} xl={3}>
                    <TextField
                    value={location.state ? location.state.email : ""}
                    fullWidth
                    select
                    label="Condición IVA"
                    >
                    </TextField>
                </Grid>
                <Grid item xs={12} md={3} lg={3} xl={3}>
                    <TextField
                    value={location.state ? location.state.email : ""}
                    type="email"
                    fullWidth
                    label="Email"
                    >
                    </TextField>
                </Grid>
                <Grid item xs={12} md={3} lg={3} xl={3}>
                    <DatePicker
                    disableFuture
                    format="dd/MM/yyyy"
                    fullWidth
                    label="Fecha de nacimiento"
                    openTo="year"
                    views={["year", "month", "date"]}>
                    </DatePicker>
                </Grid>
                <Grid item xs={12} md={3} lg={3} xl={3}>
                    <TextField
                    value={location.state ? location.state.telefono : ""}
                    type="number"
                    fullWidth
                    label="N° Teléfono">
                    </TextField>
                </Grid>
                <Grid item xs={12} md={4} lg={4} xl={4}>
                    <TextField
                    onChange={handleChangeProvinciaSeleccionada}
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
                <Grid item xs={12} md={4} lg={4} xl={4}>
                    <TextField
                    onChange={handleChangeMunicipioSeleccionado}
                    value={municipioSeleccionadoId}
                    label="Municipio"
                    fullWidth
                    select
                    >
                    {municipios.length > 0 ? municipios.map((municipio)=>(
                        <MenuItem key={municipio.MunicipioId} value={municipio.MunicipioId}>{municipio.MunicipioNombre}</MenuItem>
                    )): <MenuItem disabled>No se encontraron municipios registrados en esa provincia</MenuItem>}
                    </TextField>
                </Grid>
            </Grid>
            <Typography variant="h2"><i className="bx bx-home"></i> Datos del domicilio de instalación</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4} lg={4} xl={4}>
                    <Autocomplete
                    label="Barrio"
                    noOptionsText= "No se encontraron barrios"
                    fullWidth
                    options={barrios}
                    onChange={(event, value) => value !== "" ? setBarrioSeleccionadoId(value.BarrioId) : ""} // prints the selected value
                    getOptionLabel={(option) => option.BarrioNombre}
                    renderInput={(params) => <TextField {...params} label="Barrio" variant="standard" />}
                    >
                    </Autocomplete>
                </Grid>
                <Grid item xs={12} md={4} lg={4} xl={4}>
                    <TextField
                    value={location.state ? location.state.domicilio.calle : ""}
                    fullWidth
                    label="Calle">
                    </TextField>
                </Grid>
                <Grid item xs={12} md={2} lg={2}>
                    <TextField
                    value={location.state ? location.state.domicilio.numero : ""}
                    type="number"
                    fullWidth
                    label="Número">
                    </TextField>
                </Grid>
                <Grid item xs={12} md={2} lg={2}>
                    <TextField
                    value={location.state ? location.state.domicilio.piso : ""}
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
                    value={servicioSeleccionado}
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
                    format="dd/MM/yyyy"
                    fullWidth
                    label="Fecha de Contrato"
                    >
                    </DatePicker>
                </Grid>
                <Grid item xs={12} md={3} lg={3} xl={3}>
                    <DatePicker
                    format="dd/MM/yyyy"
                    fullWidth
                    label="Fecha de Bajada"
                    >
                    </DatePicker>
                </Grid>
            </Grid>
        </CardContent>
        <div style={{textAlign: 'center', marginBottom: '1.5rem'}}>
            <Button startIcon={<i className={location.state ? "bx bx-edit":"bx bx-check"}></i>}
            variant="contained" color="primary">
            {location.state ? "Modificar" : "Registrar"}
        </Button>
        </div>
    </Card>
    </>
    );
}
 
export default CaratulaAbonado;