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

const CambioServicio = () => {
    const appContext = useContext(AppContext);
    const {historialServicios, servicios, modelosOnu, traerServicios, traerServiciosAbonado, traerModelosONU, cambioServicioAbonado } = appContext;

    const location = useLocation();
    //Observables
    useEffect(() => {
        traerServicios();
        traerModelosONU();
        traerServiciosAbonado(location.state.UserId);
    }, [])
    //States
    const [ServicioInfo, setServicioInfo] = useState({
        UserId: location.state.UserId,
        CambioServicioFecha: new Date().toJSON(),
        CambioServicioObservaciones: null,
        OnuMac: null,
        OnuSerie: null
    })
    const onInputChange = (e) => {
        setServicioInfo({
            ...ServicioInfo,
            [e.target.name] : e.target.value
        });
    }
    const { UserId, OnuMac, OnuSerie, CambioServicioFecha, CambioServicioObservaciones} = ServicioInfo;
    const [ServicioId, setServicioId] = useState(1);
    const [ServicioNombre, setServicioNombre] = useState('Cable');
    const [ModeloOnuId, setModeloOnuId] = useState(0);
    const [ModalNuevoServicio, setModalNuevoServicio] = useState(false);
    const [FechaBajada, setFechaBajada] = useState(new Date());

    const handleChangeServicioSeleccionado = (e) => {
        setServicioId(e.target.value);
    }
    const handleFocusServicioSeleccionado = (e) => {
        setServicioNombre(e.target.innerHTML);
    }
    const handleChangeModeloONUSeleccionado = (e) => {
        setModeloOnuId(e.target.value);
    }
    const handleChangeModalNuevoServicio = () => {
        setModalNuevoServicio(!ModalNuevoServicio);
        if(!ModalNuevoServicio){
            setServicioInfo({
                UserId: location.state.UserId
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
                ModeloOnuId,
                OnuMac,
                OnuSerie
            })
            setModalNuevoServicio(false);
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
            "wrap": true
        },
        {
            "name": "Fecha de Cambio",
            "selector": row =>row["CambioServicioFecha"].split('T')[0].split('-').reverse().join('/'),
        },
        {
            "name": "Observaciones",
            "selector": row =>row["CambioServicioObservaciones"],
            "hide": "sm",
            "wrap": true
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
            <Typography style={{marginTop: '0px'}} variant="h2"><i className="bx bx-plug"></i> Datos del nuevo servicio</Typography>
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
                <Grid item xs={12} md={6} lg={6} xl={6}>
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
                <Grid item xs={12} md={6} lg={6} xl={6}>
                <TextField
                    variant = "outlined"
                    value={ModeloOnuId}
                    required
                    onChange={handleChangeModeloONUSeleccionado}
                    label="Modelo"
                    fullWidth
                    select
                    >
                    {modelosOnu.map((modeloONU)=>(
                        <MenuItem key={modeloONU.ModeloOnuId} value={modeloONU.ModeloOnuId}>{modeloONU.ModeloOnuNombre}</MenuItem>
                    ))}
                    </TextField>
                </Grid>
                <Grid item xs={12} md={6} lg={6} xl={6}>
                <TextField
                    variant = "outlined"
                    name= "OnuMac"
                    required
                    inputProps={{ maxLength: 12 }}
                    value={OnuMac}
                    onChange={onInputChange}
                    label="MAC"
                    fullWidth
                    >
                </TextField>
                </Grid>
                <Grid item xs={12} md={6} lg={6} xl={6}>
                <TextField
                    variant = "outlined"
                    name="OnuSerie"
                    required
                    value={OnuSerie}
                    onChange={onInputChange}
                    label="Nº de serie"
                    fullWidth
                    >
                </TextField>
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
                        maxLength: 100
                    }}
                    onChange={onInputChange}
                    fullWidth
                    label="Observaciones">
                    </TextField>
                    <FormHelperText>Ingrese hasta 100 palabras</FormHelperText>
                {location.state.EstadoId !== 1 ? <Alert severity="warning">Al cambiar el servicio, el abonado pasará al listado de <b>Abonados Inscriptos</b>, ya que se tiene que realizar el corte correspondiente.</Alert> : "" }
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