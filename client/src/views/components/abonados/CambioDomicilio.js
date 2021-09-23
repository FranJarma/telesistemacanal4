import React, { useState, useEffect, useContext } from 'react';
import Aside from '../design/layout/Aside';
import { Button, Card, CardContent, FormHelperText, Grid, MenuItem, TextField, Typography } from '@material-ui/core'; 
import useStyles from '../Styles';
import { useLocation } from 'react-router-dom';
import AbonadoContext from '../../../context/abonados/abonadoContext';
import ProvinciaContext from '../../../context/provincias/provinciaContext';
import MunicipioContext from '../../../context/municipios/municipioContext';
import BarrioContext from '../../../context/barrios/barrioContext';
import TextFieldBuscador from '../design/components/TextFieldBuscador';

const CambioDomicilio = () => {
    //Context
    const abonadosContext = useContext(AbonadoContext);
    const provinciasContext = useContext(ProvinciaContext);
    const municipiosContext = useContext(MunicipioContext);
    const barriosContext = useContext(BarrioContext);

    const { cambioDomicilioAbonado } = abonadosContext;
    const { provincias, traerProvincias } = provinciasContext;
    const { municipios, traerMunicipiosPorProvincia } = municipiosContext;
    const { barrios, traerBarriosPorMunicipio } = barriosContext;

    const location = useLocation();
    const styles = useStyles();
    //Observables
    useEffect(() => {
        traerProvincias();
        traerMunicipiosPorProvincia(provinciaSeleccionadaId);
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
    const [servicioSeleccionadoId, setServicioSeleccionadoId] = useState(0);
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
        if(!location.state) {
            cambioDomicilioAbonado({
                id,
                domicilioCalle,
                domicilioNumero,
                domicilioPiso,
                observacionesCambio
            })
    }
}
    return ( 
    <>
    <Aside/>
    <form onSubmit={onSubmitAbonado}>
    <Card className={styles.cartaPrincipal}>
        <CardContent>
            <Typography variant="h1">Cambio de Domicilio: {location.state.FullName}</Typography>
            <Typography variant="h2"><i className="bx bx-home"></i> Datos del último domicilio registrado</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={6} xl={6}>
                    <TextField
                    variant="filled"
                    disabled
                    //onChange={handleChangeProvinciaSeleccionada}
                    value={location.state.ProvinciaNombre}
                    label="Provincia"
                    fullWidth
                    >
                    </TextField>
                </Grid>
                <Grid item xs={12} md={6} lg={6} xl={6}>
                    <TextField
                    variant = "filled"
                    disabled
                    value={location.state.MunicipioNombre}
                    label="Municipio"
                    fullWidth
                    >
                    </TextField>
                </Grid>
                <Grid item xs={12} md={4} lg={4} xl={4}>
                <TextField
                    variant = "filled"
                    disabled
                    value={location.state.Barrio}
                    label="Barrio"
                    fullWidth
                    >
                    </TextField>
                </Grid>
                <Grid item xs={12} md={4} lg={4} xl={4}>
                    <TextField
                    variant = "filled"
                    disabled
                    value={location.state.DomicilioCalle}
                    fullWidth
                    label="Calle">
                    </TextField>
                </Grid>
                <Grid item xs={12} md={2} lg={2}>
                    <TextField
                    variant = "filled"
                    disabled
                    value={location.state.DomicilioNumero}
                    type="number"
                    fullWidth
                    label="Número">
                    </TextField>
                </Grid>
                <Grid item xs={12} md={2} lg={2}>
                    <TextField
                    variant = "filled"
                    disabled
                    value={location.state.DomicilioPiso}
                    type="number"
                    fullWidth
                    label="Piso">
                    </TextField>
                </Grid>
            </Grid>
            <Typography variant="h2"><i className="bx bx-history"></i> Historial de cambios de domicilio</Typography>
            <Card>
                <CardContent>
                    <Typography><b>a --> b</b> el día <b>03/05/2021</b></Typography>
                    <Typography><b>b --> c</b> el día <b>21/12/2021</b></Typography>
                    <Typography><b>c --> d</b> el día <b>31/05/2022</b></Typography>
                </CardContent>
            </Card>
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
    </>
    );
}
 
export default CambioDomicilio;