import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../../../context/appContext';
import Aside from '../design/layout/Aside';
import Footer from '../design/layout/Footer';
import { Button, Card, CardContent, Grid, MenuItem, TextField, Typography } from '@material-ui/core'; 
import { DatePicker } from '@material-ui/pickers';
import useStyles from '../Styles';
import { useLocation } from 'react-router-dom';
import { Alert } from '@material-ui/lab';

const CambioTitularidad = () => {
    const appContext = useContext(AppContext);
    const {barrios, municipios, provincias, domicilio, traerBarriosPorMunicipio, traerMunicipiosPorProvincia, traerProvincias, traerUltimoDomicilioAbonado } = appContext;
    
    const location = useLocation();
    const styles = useStyles();

    useEffect(() => {
        traerProvincias();
        traerMunicipiosPorProvincia(provinciaSeleccionadaId);
        traerUltimoDomicilioAbonado(location.state.UserId);
    }, [])

    const [abonadoInfo, setAbonadoInfo] = useState({
        id: location.state.UserId,
        domicilioCalle: null,
        domicilioNumero: null,
        domicilioPiso: null,
        observacionesCambio: null
    })
    const onInputChange = (e) => {
        setAbonadoInfo({
            ...abonadoInfo,
            [e.target.name] : e.target.value
        });
    }
    const { id, domicilioCalle, domicilioNumero, domicilioPiso, observacionesCambio} = abonadoInfo;
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
    const handleChangeMunicipioSeleccionado = (e) => {
        setMunicipioSeleccionadoId(e.target.value);
        setBarrioSeleccionadoId(0);
        traerBarriosPorMunicipio(e.target.value);
    }
    const handleChangeBarrioSeleccionado = (e) => {
        setBarrioSeleccionadoId(e.target.value);
    }

    const onSubmitAbonado = (e) => {
        e.preventDefault();
    //     if(location.state) {
    //         cambioDomicilioAbonado({
    //             id,
    //             provinciaSeleccionadaId
    //             municipioSeleccionadoId,
    //             barrioSeleccionadoId,
    //             domicilioCalle,
    //             domicilioNumero,
    //             domicilioPiso,
    //             observacionesCambio
    //         })
    // }
}
    return ( 
    <>
    <div className="container">
    <Aside/>
    <main>
    <form onSubmit={onSubmitAbonado}>
    <Card className={styles.cartaPrincipal}>
        <CardContent>
            <Typography variant="h1">Cambio titularidad: {location.state.FullName}</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} lg={3}>
                <Typography variant="h2"><i className="bx bx-user"></i> Datos del abonado original</Typography>
                    <Card className={styles.cartaSecundaria}>
                        <CardContent>
                            <Typography variant="h6"> <b> Nombre completo: </b> {location.state.FullName}</Typography>
                            <Typography variant="h6"> <b> DNI: </b> {location.state.Documento}</Typography>
                            <Typography variant="h6"> <b> CUIT: </b> {location.state.Cuit}</Typography>
                            <Typography variant="h6"> <b> Condición IVA: </b> {location.state.CondicionIVADescripcion}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} lg={3}>
                <Typography variant="h2"><i className="bx bx-plug"></i> Datos del servicio contratado</Typography>
                    <Card style={{paddingBottom: 'auto'}} className={styles.cartaSecundaria}>
                        <CardContent>
                            <Typography variant="h6"> <b> Tipo de servicio contratado: </b> {location.state.ServicioNombre}</Typography>
                            <Typography variant="h6"> <b> Fecha de Contrato: </b> {location.state.FechaContrato.split('T')[0]}</Typography>
                            <Typography style={{visibility: 'hidden'}} variant="h6">-</Typography>
                            <Typography style={{visibility: 'hidden'}} variant="h6">-</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} lg={3}>
                <Typography variant="h2"><i className="bx bx-home"></i> Datos del domicilio</Typography>
                    <Card style={{paddingBottom: 'auto'}} className={styles.cartaSecundaria}>
                        <CardContent>
                            <Typography variant="h6"> <b> Provincia: </b> {domicilio.ProvinciaNombre}</Typography>
                            <Typography variant="h6"> <b> Municipio: </b> {domicilio.MunicipioNombre}</Typography>
                            <Typography variant="h6"> <b> Dirección: </b> {domicilio.DomicilioCalle} {domicilio.DomicilioNumero}</Typography>
                            <Typography style={{visibility: 'hidden'}} variant="h6">-</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={3}>
                <Typography variant="h2"><i className="bx bx-broadcast"></i> Datos de ONU</Typography>
                    <Card className={styles.cartaSecundaria}>
                        <CardContent>
                            <Typography variant="h6"> <b> Tipo de ONU: </b> </Typography>
                            <Typography variant="h6"> <b> MAC: </b> </Typography>
                            <Typography variant="h6"> <b> N° Serie: </b></Typography>
                            <Typography variant="h6"> <b> Modelo: </b></Typography>
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
                    //value={nombre}
                    name="nombre"
                    onChange={onInputChange}
                    fullWidth
                    label="Nombre">
                    </TextField>
                </Grid>
                <Grid item xs={12} md={4} lg={4} xl={4}>
                    <TextField
                    variant="outlined"
                    //value={apellido}
                    name="apellido"
                    onChange={onInputChange}
                    fullWidth
                    label="Apellido">
                    </TextField>
                </Grid>
                <Grid item xs={12} md={2} lg={2} xl={2}>
                    <TextField
                    variant="outlined"
                    //value={dni}
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
                    //value={cuit}
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
                    //value={condicionIVASeleccionadoId}
                    //onChange={handleChangeCondicionIVASeleccionado}
                    fullWidth
                    select
                    label="Condición IVA"
                    >
                    {/* {condicionesIVA.map((condicionIVA)=>(
                        <MenuItem key={condicionIVA.CondicionIVAId} value={condicionIVA.CondicionIVAId}>{condicionIVA.CondicionIVADescripcion}</MenuItem>
                    ))} */}
                    </TextField>
                </Grid>
                <Grid item xs={12} md={3} lg={3} xl={3}>
                    <TextField
                    variant="outlined"
                    //value={email}
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
                    //value={fechaNacimiento}
                    //onChange={(fecha)=>setFechaNacimiento(fecha)}
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
                    //value={telefono}
                    name="telefono"
                    onChange={onInputChange}
                    type="number"
                    fullWidth
                    label="N° Teléfono">
                    </TextField>
                </Grid>
            </Grid>
            <Typography variant="h2"><i className="bx bxs-home"></i> Datos del domicilio de instalación</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={6} xl={6}>
                    <TextField
                    variant="filled"
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