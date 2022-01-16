import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../../../context/appContext';
import Aside from '../design/layout/Aside';
import Footer from '../design/layout/Footer';
import Modal from '../design/components/Modal';
import { Button, Card, CardContent, CardHeader, FormHelperText, Grid, MenuItem, TextField, Typography } from '@material-ui/core'; 
import { useLocation } from 'react-router-dom';
import Datatable from '../design/components/Datatable';
import { DatePicker } from '@material-ui/pickers';
import useStyles from './../Styles';
import { Autocomplete } from '@material-ui/lab';

const CambioServicio = () => {
    const appContext = useContext(AppContext);
    const { usuarioLogueado, historialServicios, servicios, onus, traerServicios, traerServiciosAbonado, traerONUS, traerONUPorId, cambioServicioAbonado } = appContext;

    const location = useLocation();
    const styles = useStyles();
    //Observables
    useEffect(() => {
        traerServicios();
        traerONUS(5);
        traerServiciosAbonado(location.state.UserId);
    }, [])
    //States
    const [ServicioInfo, setServicioInfo] = useState({
        UserId: location.state.UserId,
        CambioServicioObservaciones: null,
        createdBy: null
    })
    const onInputChange = (e) => {
        setServicioInfo({
            ...ServicioInfo,
            [e.target.name] : e.target.value
        });
    }
    const { UserId, CambioServicioFecha, createdBy, CambioServicioObservaciones} = ServicioInfo;
    const [ServicioId, setServicioId] = useState(1);
    const [ServicioNombre, setServicioNombre] = useState('Cable');
    const [ModalNuevoServicio, setModalNuevoServicio] = useState(false);
    const [FechaBajada, setFechaBajada] = useState(new Date());
    const [OnuId, setOnuId] = useState(0);

    const handleChangeServicioSeleccionado = (e) => {
        setServicioId(e.target.value);
    }
    const handleFocusServicioSeleccionado = (e) => {
        setServicioNombre(e.target.innerHTML);
    }

    const handleChangeModalNuevoServicio = () => {
        setModalNuevoServicio(!ModalNuevoServicio);
        if(!ModalNuevoServicio){
            setServicioInfo({
                UserId: location.state.UserId,
                createdBy: sessionStorage.getItem('identity')
            })
        }
        else {
            setServicioInfo({
                UserId: null
            })
        }
    }

    const onSubmitAbonado = (e) => {
        e.preventDefault();
        if(location.state) {
            cambioServicioAbonado({
                UserId,
                ServicioId,
                ServicioNombre,
                FechaBajada,
                CambioServicioFecha,
                CambioServicioObservaciones,
                createdBy
            }, setModalNuevoServicio)
            traerONUPorId(location.state.OnuId);
    }
}
    const columnasServicios = [
        {
            "name": "id",
            "selector": row =>row["UserId"],
            "omit": true,
        },
        {
            "name": "Servicio",
            "selector": row =>row["OnuMac"] ? row["ServicioNombre"] + ' | ' + "MAC Onu:" + ' ' + row["OnuMac"] : row["ServicioNombre"],
            "wrap": true,
            "sortable": true
        },
        {
            "name": "Fecha de Cambio",
            "selector": row =>row["createdAt"].split('T')[0].split('-').reverse().join('/'),
            "sortable": true
        },
        {
            "name": "Observaciones",
            "selector": row =>row["CambioServicioObservaciones"],
            "hide": "sm",
            "wrap": true,
            "sortable": true
        },
    ]
    const ExpandedComponent = ({ data }) =>
    <>
        <Typography style={{fontWeight: 'bold'}} variant="h6"><i className="bx bx-clipboard"></i> Observaciones: {data.CambioServicioObservaciones}</Typography>
    </>;
    return ( 
    <>
    <div className="container">
    <Aside/>
    <main>
    <Card>
        <CardHeader
            action={<Button onClick={setModalNuevoServicio} variant="contained" color="primary">+ Nuevo servicio</Button>}>
        </CardHeader>
        <CardContent>
            <Typography variant="h1">Historial de cambios de servicio del abonado: {location.state.Apellido}, {location.state.Nombre}</Typography>
            <br/>
            <Datatable
            loader={true}
            expandedComponent={ExpandedComponent}
            datos={historialServicios}
            columnas={columnasServicios}
            paginacion={true}
            buscar={true}/>
            <FormHelperText>Los servicios están ordenados por fecha más reciente</FormHelperText>
            <br/>
        </CardContent>
        <Modal
        abrirModal={ModalNuevoServicio}
        funcionCerrar={handleChangeModalNuevoServicio}
        botones={
        <>
        <Button
            variant="contained"
            color="primary"
            onClick={onSubmitAbonado}>
            Agregar</Button>
        <Button onClick={handleChangeModalNuevoServicio}>Cerrar</Button></>}
        formulario={
            <>
            <Typography style={{marginTop: '0px'}} variant="h2"><i className="bx bx-info-square"></i> Datos importantes</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={6} xl={6}>
                    <Card className={styles.cartaSecundaria}>
                        <CardContent>
                            <Typography variant="h6"><b>Domicilio actual: </b>{location.state.DomicilioCalle}, {location.state.DomicilioNumero}</Typography>
                            <Typography variant="h6"><b>Barrio: </b>{location.state.BarrioNombre}</Typography>
                            <Typography variant="h6"><b>Municipio: </b> {location.state.MunicipioNombre}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6} lg={6} xl={6}>
                    <Card className={styles.cartaSecundaria}>
                        <CardContent>
                            <Typography variant="h6"><b>Servicio actual: </b> {location.state.ServicioNombre}</Typography>
                            <Typography variant="h6"><b>Fecha de contrato: </b> {location.state.FechaContrato.split('T')[0].split('-').reverse().join('/')}</Typography>
                            {location.state.OnuMac ? <Typography variant="h6"><b>MAC ONU: </b> {location.state.OnuMac}</Typography> : ""}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <br/>
            <Typography style={{marginTop: '0px'}} variant="h2"><i className="bx bx-plug"></i> Datos del nuevo servicio</Typography>
            <Grid container spacing={3}>
                <Grid item xs={6} md={6} lg={6} xl={6}>
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
                <Grid item xs={6} md={6} lg={6} xl={6}>
                    <TextField
                    variant="outlined"
                    onChange={handleChangeServicioSeleccionado}
                    onFocus={handleFocusServicioSeleccionado}
                    value={ServicioId}
                    label="Servicio"
                    fullWidth
                    select
                    >
                    {servicios.map((servicio)=>(
                        <MenuItem key={servicio.ServicioId} value={servicio.ServicioId}>{servicio.ServicioNombre}</MenuItem>
                    ))}
                    </TextField>
                </Grid>
            </Grid>
            {ServicioId !== 1 ?
            <>
            <Typography variant="h2"><i className='bx bx-broadcast'></i> Datos de ONU</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={12} lg={12} xl={12}>
                    <TextField
                    variant="outlined"
                    disabled
                    value={ServicioId}
                    label="Tipo de ONU"
                    fullWidth
                    select
                    >
                    {servicios.map((servicio)=>(
                        <MenuItem key={servicio.ServicioId} value={servicio.ServicioId}>{servicio.ServicioNombre}</MenuItem>
                    ))}
                    </TextField>
                </Grid>
                <Grid item xs={12} md={12} lg={12} xl={12}>
                <Autocomplete
                disableClearable
                value={OnuId}
                onChange={(_event, newOnuId) => {
                    setOnuId(newOnuId);
                }}
                options={onus}
                noOptionsText="No se encontraron ONUS disponibles"
                getOptionLabel={(option) => option.OnuMac}
                renderInput={(params) => <TextField {...params} variant = "outlined" fullWidth label="MAC ONU"/>}
                />
                </Grid>
            </Grid>
            </>
            : "" }
            <Grid container spacing={3}>
                <Grid item xs={12} md={12} lg={12} xl={12}>
                    <TextField
                    variant = "outlined"
                    multiline
                    minRows={3}
                    value={CambioServicioObservaciones}
                    name="CambioServicioObservaciones"
                    inputProps={{
                        maxLength: 1000
                    }}
                    onChange={onInputChange}
                    fullWidth
                    label="Observaciones">
                    </TextField>
                    <FormHelperText>Ingrese hasta 1000 palabras</FormHelperText>
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
 
export default CambioServicio;