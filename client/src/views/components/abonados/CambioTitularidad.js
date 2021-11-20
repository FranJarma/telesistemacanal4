import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../../../context/appContext';
import Aside from '../design/layout/Aside';
import Footer from '../design/layout/Footer';
import { Button, Card, CardContent, FormControlLabel, FormGroup, Grid, MenuItem, Switch, TextField, Typography } from '@material-ui/core'; 
import { DatePicker } from '@material-ui/pickers';
import useStyles from '../Styles';
import { useLocation } from 'react-router-dom';
import { Alert } from '@material-ui/lab';

const CambioTitularidad = () => {
    const appContext = useContext(AppContext);
    const {barrios, condicionesIva, municipios, provincias, traerBarriosPorMunicipio, traerMunicipiosPorProvincia, traerProvincias, traerCondicionesIva, cambioTitularidadAbonado } = appContext;
    
    const location = useLocation();
    const styles = useStyles();

    const [abonadoInfo, setAbonadoInfo] = useState({
        UserIdViejo: location.state.UserId,
        Nombre: null,
        Apellido: null,
        Documento: null,
        Cuit: null,
        Email: null,
        Telefono: null,
        DomicilioCalle: null,
        DomicilioNumero: null,
        DomicilioPiso: null,
        OnuId: location.state.OnuId ? location.state.OnuId : null,
        ServicioId: location.state.ServicioId
    });

    const onInputChange = (e) => {
        setAbonadoInfo({
            ...abonadoInfo,
            [e.target.name] : e.target.value
        });
    }
    const { UserIdViejo, Nombre, Apellido, Documento, Cuit, Email, Telefono, DomicilioCalle, DomicilioNumero, DomicilioPiso, OnuId, ServicioId} = abonadoInfo;
    //seteamos en 10 para que traiga jujuy directamente
    const [ProvinciaId, setProvinciaId] = useState(10);
    //para más adelante cuando vayan a otras provincias
    /*
    const handleChangeProvinciaSeleccionada = (e) => {
        setProvinciaSeleccionadaId(e.target.value);
        setMunicipioSeleccionadoId(0);
        setBarrioSeleccionadoId(0);
        traerMunicipiosPorProvincia(e.target.value);
    }*/
    const [MunicipioId, setMunicipioId] = useState(0);
    const [BarrioId, setBarrioId] = useState(0);
    const [CondicionIvaId, setCondicionIvaId] = useState(0);
    const [FechaNacimiento, setFechaNacimiento] = useState(new Date());
    const [FechaContrato, setFechaContrato] = useState(new Date());
    const [FechaBajada, setFechaBajada] = useState(new Date());
    const [DomicilioId, setDomicilioId] = useState(0);

    const [MismoDomicilio, setMismoDomicilio] = useState(false);
    const handleChangeCheckMismoDomicilio = e => {
        setMismoDomicilio(!MismoDomicilio);
        if(!MismoDomicilio){
            setProvinciaId(location.state.ProvinciaId);
            setMunicipioId(location.state.MunicipioId);
            setBarrioId(location.state.BarrioId);
            setAbonadoInfo({
                ...abonadoInfo,
                DomicilioCalle: location.state.DomicilioCalle,
                DomicilioNumero: location.state.DomicilioNumero,
                DomicilioPiso: location.state.DomicilioPiso
            });
            setDomicilioId(0);
        }
        else {
            setMunicipioId(0);
            setBarrioId(0);
            setAbonadoInfo({
                ...abonadoInfo,
                DomicilioCalle: null,
                DomicilioNumero: null,
                DomicilioPiso: null
            });
            setDomicilioId(location.state.DomicilioId);
        }
    }
    const handleChangeMunicipioSeleccionado = (e) => {
        setMunicipioId(e.target.value);
        setBarrioId(0);
        traerBarriosPorMunicipio(e.target.value);
    }
    const handleChangeBarrioSeleccionado = (e) => {
        setBarrioId(e.target.value);
    }
    const handleChangeCondicionIVASeleccionado = (e) => {
        setCondicionIvaId(e.target.value);
    }

    
    useEffect(() => {
        traerProvincias();
        traerMunicipiosPorProvincia(ProvinciaId);
        traerBarriosPorMunicipio(MunicipioId);
        traerCondicionesIva();
    }, [])

    const onSubmitCambioTitularidad = (e) => {
        e.preventDefault();
        cambioTitularidadAbonado({
            UserIdViejo, //es el ID del abonado viejo, el resto de los datos son del nuevo
            Nombre,
            Apellido,
            Documento,
            Cuit,
            Email,
            Telefono,
            DomicilioCalle,
            DomicilioNumero,
            DomicilioPiso,
            FechaNacimiento,
            FechaContrato,
            FechaBajada,
            CondicionIvaId,
            ProvinciaId,
            MunicipioId,
            BarrioId,
            DomicilioId,
            OnuId,
            ServicioId
        });
}
    return ( 
    <>
    <div className="container">
    <Aside/>
    <main>
    <form onSubmit={onSubmitCambioTitularidad}>
    <Card>
        <CardContent>
            <Typography variant="h1">Cambio titularidad: {location.state.Nombre} {location.state.Apellido}</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} lg={3}>
                <Typography variant="h2"><i className="bx bx-user"></i> Datos del abonado original</Typography>
                    <Card className={styles.cartaSecundaria}>
                        <CardContent>
                            <Typography variant="h6"> <b> Nombre completo: </b> {location.state.Nombre} {location.state.Apellido}</Typography>
                            <Typography variant="h6"> <b> DNI: </b> {location.state.Documento}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} lg={3}>
                <Typography variant="h2"><i className="bx bx-plug"></i> Datos del servicio contratado</Typography>
                    <Card className={styles.cartaSecundaria}>
                        <CardContent>
                            <Typography variant="h6"> <b> Tipo de servicio contratado: </b> {location.state.ServicioNombre}</Typography>
                            <Typography variant="h6"> <b> Fecha de Contrato: </b> {location.state.FechaContrato.split('T')[0]}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} lg={3}>
                <Typography variant="h2"><i className="bx bx-home"></i> Datos del domicilio</Typography>
                    <Card style={{paddingBottom: 'auto'}} className={styles.cartaSecundaria}>
                        <CardContent>
                            <Typography variant="h6"> <b> Dirección: </b> {location.state.DomicilioCalle} {location.state.DomicilioNumero}</Typography>
                            <Typography variant="h6"> <b> Barrio: </b> {location.state.BarrioNombre}, {location.state.MunicipioNombre} {location.state.ProvinciaNombre}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} lg={3}>
                <Typography variant="h2"><i className="bx bx-broadcast"></i> Datos de ONU</Typography>
                    <Card className={styles.cartaSecundaria}>
                        <CardContent>
                            {location.state.OnuMac ? 
                            <>
                            <Typography variant="h6"> <b> MAC: </b> {location.state.OnuMac} </Typography>
                            <Typography variant="h6"> <b> N° Serie: </b>{location.state.OnuSerie}</Typography>
                            <Typography variant="h6"> <b> Modelo:</b> {location.state.ModeloOnuNombre}</Typography>
                            </>
                            : <Typography variant="h6">Sin ONU</Typography>}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Typography variant="h2"><i className="bx bxs-user"></i> Datos del nuevo titular</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4} lg={4} xl={4}>
                    <TextField
                    autoFocus
                    variant="outlined"
                    value={Nombre}
                    name="Nombre"
                    onChange={onInputChange}
                    fullWidth
                    label="Nombre">
                    </TextField>
                </Grid>
                <Grid item xs={12} md={4} lg={4} xl={4}>
                    <TextField
                    variant="outlined"
                    value={Apellido}
                    name="Apellido"
                    onChange={onInputChange}
                    fullWidth
                    label="Apellido">
                    </TextField>
                </Grid>
                <Grid item xs={12} md={2} lg={2} xl={2}>
                    <TextField
                    variant="outlined"
                    value={Documento}
                    name="Documento"
                    inputProps={{ maxLength: 8 }}
                    onChange={onInputChange}
                    fullWidth
                    label="DNI">
                    </TextField>
                </Grid>
                <Grid item xs={12} md={2} lg={2} xl={2}>
                    <TextField
                    variant="outlined"
                    value={Cuit}
                    name="Cuit"
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
                    value={CondicionIvaId}
                    onChange={handleChangeCondicionIVASeleccionado}
                    fullWidth
                    select
                    label="Condición IVA"
                    >
                    {condicionesIva.map((condicionIVA)=>(
                        <MenuItem key={condicionIVA.CondicionIvaId} value={condicionIVA.CondicionIvaId}>{condicionIVA.CondicionIvaNombre}</MenuItem>
                    ))}
                    </TextField>
                </Grid>
                <Grid item xs={12} md={3} lg={3} xl={3}>
                    <TextField
                    variant="outlined"
                    value={Email}
                    name="Email"
                    onChange={onInputChange}
                    fullWidth
                    label="Email"
                    >
                    </TextField>
                </Grid>
                <Grid item xs={12} md={3} lg={3} xl={3}>
                    <DatePicker 
                    inputVariant="outlined"
                    value={FechaNacimiento}
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
                    value={Telefono}
                    name="Telefono"
                    onChange={onInputChange}
                    type="number"
                    fullWidth
                    label="N° Teléfono">
                    </TextField>
                </Grid>
            </Grid>
            <Typography variant="h2"><i className="bx bxs-home"></i> Datos del domicilio de instalación</Typography>
            <FormGroup>
                <FormControlLabel control={<Switch color="primary" onChange={handleChangeCheckMismoDomicilio} checked={MismoDomicilio}></Switch>} label="Mismo domicilio que el titular"></FormControlLabel>
            </FormGroup>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={6} xl={6}>
                    <TextField
                    variant="filled"
                    disabled
                    //onChange={handleChangeProvinciaSeleccionada}
                    value={ProvinciaId}
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
                    variant = {!MismoDomicilio ? "outlined" : "filled"}
                    disabled ={!MismoDomicilio ? false : true}
                    onChange={handleChangeMunicipioSeleccionado}
                    value={MunicipioId}
                    label="Municipio"
                    fullWidth
                    select
                    >
                    {municipios.length > 0 ? municipios.map((municipio)=>(
                        <MenuItem key={municipio.MunicipioId} value={municipio.MunicipioId}>{municipio.MunicipioNombre}</MenuItem>
                    )): <MenuItem disabled>No se encontraron municipios</MenuItem>}
                    </TextField>
                </Grid>
                <Grid item xs={12} md={4} lg={4} xl={4}>
                <TextField
                    variant = {!MismoDomicilio ? "outlined" : "filled"}
                    disabled ={!MismoDomicilio ? false : true}
                    onChange={handleChangeBarrioSeleccionado}
                    value={BarrioId}
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
                    variant = {!MismoDomicilio ? "outlined" : "filled"}
                    disabled ={!MismoDomicilio ? false : true}
                    value={DomicilioCalle}
                    name="DomicilioCalle"
                    onChange={onInputChange}
                    fullWidth
                    label="Calle">
                    </TextField>
                </Grid>
                <Grid item xs={12} md={2} lg={2}>
                    <TextField
                    variant = {!MismoDomicilio ? "outlined" : "filled"}
                    disabled ={!MismoDomicilio ? false : true}
                    value={DomicilioNumero}
                    name="DomicilioNumero"
                    onChange={onInputChange}
                    type="number"
                    fullWidth
                    label="Número">
                    </TextField>
                </Grid>
                <Grid item xs={12} md={2} lg={2}>
                    <TextField
                    variant = {!MismoDomicilio ? "outlined" : "filled"}
                    disabled ={!MismoDomicilio ? false : true}
                    value={DomicilioPiso}
                    name="DomicilioPiso"
                    onChange={onInputChange}
                    type="number"
                    fullWidth
                    label="Piso">
                    </TextField>
                </Grid>
            </Grid>
            <Typography  variant="h2"><i className="bx bx-calendar"></i> Fechas de contrato y de bajada</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4} lg={4} xl={4}>
                    <DatePicker 
                    inputVariant="outlined"
                    value={FechaContrato}
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
                    value={FechaBajada}
                    onChange={(fecha)=>setFechaBajada(fecha)}
                    format="dd/MM/yyyy"
                    fullWidth
                    label="Fecha de Bajada"
                    >
                    </DatePicker >
                </Grid>
            </Grid>
            <br/>
        <Alert severity="info">Una vez que se realice el cambio de la titularidad, el abonado original será <b>dado de baja</b> y toda la información de pagos será <b>transferida</b> al nuevo titular.</Alert>
        </CardContent>
        <div style={{textAlign: 'center', marginBottom: '1.5rem'}}>
            <Button type="submit" startIcon={<i className="bx bx-edit"></i>}
            variant="contained" color="primary">Modificar
            </Button>
        </div>
    </Card>
    </form>
    </main>
    <Footer/>
    </div>
    </>
    );
}
 
export default CambioTitularidad;