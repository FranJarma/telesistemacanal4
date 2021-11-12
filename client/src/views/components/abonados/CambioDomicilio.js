import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../../../context/appContext';
import Aside from '../design/layout/Aside';
import Footer from '../design/layout/Footer';
import Modal from '../design/components/Modal';
import { Button, Card, CardContent, CardHeader, FormHelperText, Grid, MenuItem, TextField, Typography } from '@material-ui/core'; 
import { useLocation } from 'react-router-dom';
import Datatable from '../design/components/Datatable';
import { Alert } from '@material-ui/lab';
import { DatePicker } from '@material-ui/pickers';

const CambioDomicilio = () => {
    const appContext = useContext(AppContext);
    const {barrios, historialDomicilios, municipios, provincias, traerBarriosPorMunicipio, traerDomiciliosAbonado, traerMunicipiosPorProvincia,
    traerProvincias, cambioDomicilioAbonado } = appContext;
    const location = useLocation();
    //Observables
    useEffect(() => {
        traerProvincias();
        traerMunicipiosPorProvincia(ProvinciaId);
        traerDomiciliosAbonado(location.state.UserId);
    }, [])
    //States
    const [DomicilioInfo, setDomicilioInfo] = useState({
        UserId: location.state.UserId,
        DomicilioCalle: null,
        DomicilioNumero: null,
        DomicilioPiso: null,
        CambioDomicilioFecha: new Date().toJSON(),
        CambioDomicilioObservaciones: null,
    })
    const onInputChange = (e) => {
        setDomicilioInfo({
            ...DomicilioInfo,
            [e.target.name] : e.target.value
        });
    }
    const { UserId, DomicilioCalle, DomicilioNumero, DomicilioPiso, CambioDomicilioFecha, CambioDomicilioObservaciones} = DomicilioInfo;
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
    const [BarrioId, setBarrioId] = useState(0);
    const [BarrioNombre, setBarrioNombre] = useState('')
    const [MunicipioId, setMunicipioId] = useState(0);
    const [MunicipioNombre, setMunicipioNombre] = useState('')
    const [ModalNuevoDomicilio, setModalNuevoDomicilio] = useState(false);
    const [FechaBajada, setFechaBajada] = useState(new Date());

    const handleChangeMunicipioSeleccionado = (e) => {
        setMunicipioId(e.target.value);
        setBarrioId(0);
        traerBarriosPorMunicipio(e.target.value);
    }
    const handleFocusMunicipioSeleccionado = (e) => {
        setMunicipioNombre(e.target.innerHTML)
    }
    const handleFocusBarrioSeleccionado = (e) => {
        setBarrioNombre(e.target.innerHTML)
    }
    const handleChangeBarrioSeleccionado = (e) => {
        setBarrioId(e.target.value);
    }
    const handleChangeModalNuevoDomicilio = () => {
        setModalNuevoDomicilio(!ModalNuevoDomicilio);
        setDomicilioInfo({
            UserId: location.state.UserId
        })
    }

    const onSubmitAbonado = (e) => {
        e.preventDefault();
        if(location.state) {
            cambioDomicilioAbonado({
                UserId,
                //ProvinciaId
                BarrioId,
                BarrioNombre,
                MunicipioId,
                MunicipioNombre,
                DomicilioCalle,
                DomicilioNumero,
                DomicilioPiso,
                FechaBajada,
                CambioDomicilioFecha,
                CambioDomicilioObservaciones
            }, setModalNuevoDomicilio)
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
            "selector": row => row["DomicilioCalle"] + ', ' + row["DomicilioNumero"],
            "wrap": true
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
            "selector": row =>row["CambioDomicilioFecha"].split('T')[0].split('-').reverse().join('/'),
            "hide": "sm"
        },
        {
            "name": "Observaciones",
            "selector": row =>row["CambioDomicilioObservaciones"],
            "hide": "sm",
            "wrap": true
        },
    ]
    const ExpandedComponent = ({ data }) =>
    <>
        <Typography style={{fontWeight: 'bold'}} variant="h6"><i className="bx bx-home"></i> Dirección: {data.DomicilioCalle} {data.DomicilioNumero}</Typography>
        <Typography style={{fontWeight: 'bold'}} variant="h6"><i className="bx bxs-home"></i> Barrio: {data.BarrioNombre}</Typography>
        <Typography style={{fontWeight: 'bold'}} variant="h6"><i className="bx bx-building-house"></i> Municipio: {data.MunicipioNombre}</Typography>
        <Typography style={{fontWeight: 'bold'}} variant="h6"><i className="bx bx-calendar"></i> Fecha de Cambio: {data.CambioDomicilioFecha.split('T')[0].split('-').reverse().join('/')}</Typography>
        <Typography style={{fontWeight: 'bold'}} variant="h6"><i className="bx bx-clipboard"></i> Observaciones: {data.CambioDomicilioObservaciones}</Typography>
    </>;
    return ( 
    <>
    <div className="container">
    <Aside/>
    <main>
    <Card>
        <CardHeader
            action={<Button onClick={setModalNuevoDomicilio} variant="contained" color="primary">+ Nuevo Domicilio</Button>}>
        </CardHeader>
        <CardContent>
            <Typography variant="h1">Historial de cambios de domicilio del abonado: {location.state.Apellido}, {location.state.Nombre}</Typography>
            <br/>
            <Datatable
            loader={true}
            expandedComponent={ExpandedComponent}
            datos={historialDomicilios}
            columnas={columnasDomicilios}
            paginacion={true}
            buscar={true}/>
            <FormHelperText>Los domicilios están ordenados por fecha más reciente</FormHelperText>
            <br/>
        </CardContent>
        <Modal
        abrirModal={ModalNuevoDomicilio}
        funcionCerrar={handleChangeModalNuevoDomicilio}
        botones={
        <>
        <Button
            variant="contained"
            color="primary"
            onClick={onSubmitAbonado}>
            Agregar</Button>
        <Button onClick={handleChangeModalNuevoDomicilio}>Cerrar</Button></>}
        formulario={
            <>
            <Typography style={{marginTop: '0px'}} variant="h2"><i className="bx bx-home"></i> Datos del nuevo domicilio</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={12} lg={12} xl={12}>
                    <DatePicker
                    inputVariant="outlined"
                    value={FechaBajada}
                    onChange={(fecha)=>setFechaBajada(fecha)}
                    format="dd/MM/yyyy"
                    fullWidth
                    label="Fecha de Bajada"
                    >
                    </DatePicker>
                </Grid>
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
                    onFocus={handleFocusMunicipioSeleccionado}
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
                    onFocus={handleFocusBarrioSeleccionado}
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
                        maxLength: 1000
                    }}
                    onChange={onInputChange}
                    fullWidth
                    label="Observaciones">
                    </TextField>
                    <FormHelperText>Ingrese hasta 1000 palabras</FormHelperText>
                    {location.state.EstadoId !== 1 ? <Alert severity="warning">Al cambiar el domicilio, el abonado pasará al listado de <b>Abonados Inscriptos</b>, ya que se tiene que realizar el corte correspondiente.</Alert> : "" }
                </Grid>
            </Grid>
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