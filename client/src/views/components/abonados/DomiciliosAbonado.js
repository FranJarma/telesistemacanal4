import React, { useState, useEffect, useContext } from 'react';
import Aside from '../design/layout/Aside';
import { Button, Card, CardContent, FormHelperText, Grid, MenuItem, TextField, Typography } from '@material-ui/core'; 
import useStyles from '../Styles';
import { useLocation } from 'react-router-dom';
import BreadCrumb from '../design/components/Breadcrumb';
import AbonadoContext from '../../../context/abonados/abonadoContext';
import ProvinciaContext from '../../../context/provincias/provinciaContext';
import MunicipioContext from '../../../context/municipios/municipioContext';
import BarrioContext from '../../../context/barrios/barrioContext';
import Footer from '../design/layout/Footer';

const CambioDomicilio = () => {
    //Context
    const abonadosContext = useContext(AbonadoContext);
    const provinciasContext = useContext(ProvinciaContext);
    const municipiosContext = useContext(MunicipioContext);
    const barriosContext = useContext(BarrioContext);

    const { cambioDomicilioAbonado, traerDomiciliosAbonado, domicilios } = abonadosContext;
    const { provincias, traerProvincias } = provinciasContext;
    const { municipios, traerMunicipiosPorProvincia } = municipiosContext;
    const { barrios, traerBarriosPorMunicipio } = barriosContext;

    const location = useLocation();
    const styles = useStyles();
    //Observables
    useEffect(() => {
        traerProvincias();
        traerMunicipiosPorProvincia(provinciaSeleccionadaId);
        traerDomiciliosAbonado(location.state.UserId);
    }, [])
    //States
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

    //SUBMIT
    const onSubmitAbonado = (e) => {
        e.preventDefault();
        if(location.state) {
            cambioDomicilioAbonado({
                id,
                //provinciaSeleccionadaId
                municipioSeleccionadoId,
                barrioSeleccionadoId,
                domicilioCalle,
                domicilioNumero,
                domicilioPiso,
                observacionesCambio
            })
    }
}
    return ( 
    <>
    <div className="container">
    <Aside/>
    <main>
    <form onSubmit={onSubmitAbonado}>
    <Card className={styles.cartaPrincipal}>
        <CardContent>
            <Typography variant="h1">Listado de Domicilios del abonado: {location.state.FullName}</Typography>
            <br/>
            <Grid container spacing={3}>
                {domicilios.map((domicilio)=>(
                    <>
                    <Grid item xs={12} sm={6} md={6} lg={3}>
                        <Card className={styles.cartaSecundaria} key={domicilio.DomicilioId} value={domicilio.DomicilioId}>
                            <CardContent>
                                <Typography variant="h6"> <b> Municipio: </b> {domicilio.MunicipioNombre}</Typography>
                                <Typography variant="h6"> <b> Barrio: </b> {domicilio.BarrioNombre}</Typography>
                                <Typography variant="h6"> <b> Dirección: </b> {domicilio.DomicilioCalle} {domicilio.DomicilioNumero}</Typography>
                                <Typography variant="h6"> <b> Fecha: </b> {domicilio.CambioDomicilioFecha.split('T')[0]}</Typography>
                                <Typography variant="h6"> <b> Observaciones: </b> {domicilio.CambioDomicilioObservaciones}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <br/>
                    </>
                ))}
            </Grid>
            <FormHelperText>Los domicilios están ordenados por fecha más reciente</FormHelperText>
            <Typography variant="h2"><i className="bx bx-home"></i> Datos del nuevo domicilio</Typography>
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
                <Grid item xs={12} md={12} lg={12} xl={12}>
                    <TextField
                    variant = "outlined"
                    multiline
                    minRows={3}
                    value={observacionesCambio}
                    name="observacionesCambio"
                    inputProps={{
                        maxLength: 100
                    }}
                    onChange={onInputChange}
                    fullWidth
                    label="Observaciones">
                    </TextField>
                    <FormHelperText>Ingrese hasta 100 palabras</FormHelperText>
                </Grid>
            </Grid>
            <br/>
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
 
export default CambioDomicilio;