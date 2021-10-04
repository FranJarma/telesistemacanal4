import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../../../context/appContext';
import Aside from '../design/layout/Aside';
import Footer from '../design/layout/Footer';
import Modal from '../design/components/Modal';
import { Button, Card, CardContent, CardHeader, FormHelperText, Grid, MenuItem, TextField, Typography } from '@material-ui/core'; 
import useStyles from '../Styles';
import { Link, useLocation } from 'react-router-dom';
import Datatable from '../design/components/Datatable';


const CambioDomicilio = () => {
    const appContext = useContext(AppContext);
    const {barrios, domicilios, municipios, provincias, traerBarriosPorMunicipio, traerDomiciliosAbonado, traerMunicipiosPorProvincia,
    traerProvincias, cambioDomicilioAbonado } = appContext;

    const location = useLocation();
    const styles = useStyles();
    //Observables
    useEffect(() => {
        traerProvincias();
        traerMunicipiosPorProvincia(ProvinciaId);
        traerDomiciliosAbonado(location.state.UserId);
    }, [])
    //States
    const [domicilioInfo, setDomicilioInfo] = useState({
        id: location.state.UserId,
        DomicilioCalle: null,
        DomicilioNumero: null,
        DomicilioPiso: null,
        CambioDomicilioObservaciones: null
    })
    const onInputChange = (e) => {
        setDomicilioInfo({
            ...domicilioInfo,
            [e.target.name] : e.target.value
        });
    }
    const { id, DomicilioCalle, DomicilioNumero, DomicilioPiso, CambioDomicilioObservaciones} = domicilioInfo;
    //seteamos en 10 para que traiga jujuy directamente
    const [ProvinciaId, setProvinciaId] = useState(10);
    //para más adelante cuando vayan a otras provincias
    /*
    const handleChangeProvinciaSeleccionada = (e) => {
        setProvinciaId(e.target.value);
        setMunicipioId(0);
        setBarrioId(0);
        traerMunicipiosPorProvincia(e.target.value);
    }*/
    const [MunicipioId, setMunicipioId] = useState(0);
    const [BarrioId, setBarrioId] = useState(0);
    const [modalNuevoDomicilio, setModalNuevoDomicilio] = useState(false);
    const handleChangeMunicipioSeleccionado = (e) => {
        setMunicipioId(e.target.value);
        setBarrioId(0);
        traerBarriosPorMunicipio(e.target.value);
    }
    const handleChangeBarrioSeleccionado = (e) => {
        setBarrioId(e.target.value);
    }
    const handleChangeModalNuevoDomicilio = (data) => {
        setModalNuevoDomicilio(!modalNuevoDomicilio)
        if(!modalNuevoDomicilio){
            setDomicilioInfo({
                id: data.UserId
            })
        }
        else {
            setDomicilioInfo({
                id: null
            })
        }
    }

    const onSubmitAbonado = (e) => {
        e.preventDefault();
        if(location.state) {
            cambioDomicilioAbonado({
                id,
                //ProvinciaId
                MunicipioId,
                BarrioId,
                DomicilioCalle,
                DomicilioNumero,
                DomicilioPiso,
                CambioDomicilioObservaciones
            })
    }
}
    const columnasDomicilios = [
        {
            "name": "id",
            "selector": row =>row["UserId"],
            "omit": true,
        },
        {
            "name": "Dirección",
            "selector": row => row["DomicilioCalle"] + ', ' + row["DomicilioNumero"]
        },
        {
            "name": "Barrio",
            "selector": row =>row["BarrioNombre"],
            "hide": "sm"
        },
        {
            "name": "Municipio",
            "selector": row =>row["MunicipioNombre"],
        },
        {
            "name": "Fecha de Cambio",
            "selector": row =>row["CambioDomicilioFecha"].split('T')[0],
            "hide": "sm"
        },
        {
            "name": "Observaciones",
            "selector": row =>row["CambioDomicilioObservaciones"],
            "hide": "sm"
        },
    ]
    const ExpandedComponent = ({ data }) =>
    <>
        <Typography style={{fontWeight: 'bold'}} variant="h6"><i className="bx bx-home"></i> Dirección: {data.DomicilioCalle} {data.DomicilioNumero}</Typography>
        <Typography style={{fontWeight: 'bold'}} variant="h6"><i className="bx bxs-home"></i> Barrio: {data.BarrioNombre}</Typography>
        <Typography style={{fontWeight: 'bold'}} variant="h6"><i className="bx bx-building-house"></i> Municipio: {data.MunicipioNombre}</Typography>
        <Typography style={{fontWeight: 'bold'}} variant="h6"><i className="bx bx-calendar"></i> Fecha de Cambio: {data.CambioDomicilioFecha.split('T')[0]}</Typography>
    </>;
    return ( 
    <>
    <div className="container">
    <Aside/>
    <main>
    <Card className={styles.cartaPrincipal}>
        <CardHeader
            action={<Button onClick={setModalNuevoDomicilio} variant="contained" color="primary">+ Nuevo Domicilio</Button>}>
        </CardHeader>
        <CardContent>
            <Typography variant="h1">Listado de Domicilios del abonado: {location.state.FullName}</Typography>
            <br/>
            <Datatable
            expandedComponent={ExpandedComponent}
            datos={domicilios}
            columnas={columnasDomicilios}>
            </Datatable>
            <FormHelperText>Los domicilios están ordenados por fecha más reciente</FormHelperText>
            <br/>
        </CardContent>
        <Modal
        abrirModal={modalNuevoDomicilio}
        funcionCerrar={handleChangeModalNuevoDomicilio}
        botones={
        <>
        <Button onClick={()=>
            {
            setModalNuevoDomicilio(false)}}
            variant="contained"
            color="primary">
            Agregar</Button>
        <Button onClick={handleChangeModalNuevoDomicilio}>Cerrar</Button></>}
        formulario={
            <>
            <Typography style={{marginTop: '0px'}} variant="h2"><i className="bx bx-home"></i> Datos del nuevo domicilio</Typography>
            <form onSubmit={onSubmitAbonado}>   
            <Grid container spacing={3}>
                <Grid item xs={12} md={12} lg={12} xl={12}>
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
                    variant = "outlined"
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
                <Grid item xs={12} md={6} lg={6} xl={6}>
                <TextField
                    variant = "outlined"
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
                <Grid item xs={12} md={12} lg={12} xl={12}>
                    <TextField
                    variant = "outlined"
                    value={DomicilioCalle}
                    name="DomicilioCalle"
                    onChange={onInputChange}
                    fullWidth
                    label="Calle">
                    </TextField>
                </Grid>
                <Grid item xs={12} md={6} lg={6} xl={6}>
                    <TextField
                    variant = "outlined"
                    value={DomicilioNumero}
                    name="DomicilioNumero"
                    onChange={onInputChange}
                    type="number"
                    fullWidth
                    label="Número">
                    </TextField>
                </Grid>
                <Grid item xs={12} md={6} lg={6} xl={6}>
                    <TextField
                    variant = "outlined"
                    value={DomicilioPiso}
                    name="DomicilioPiso"
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
                    value={CambioDomicilioObservaciones}
                    name="CambioDomicilioObservaciones"
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
            </form>
            </>
        }></Modal>
        </Card>
    </main>
    <Footer/>
    </div>
    </>
    );
}
 
export default CambioDomicilio;