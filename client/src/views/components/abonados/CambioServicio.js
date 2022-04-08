import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../../../context/appContext';
import Aside from '../design/layout/Aside';
import Footer from '../design/layout/Footer';
import Modal from '../design/components/Modal';
import { Button, Card, CardContent, CardHeader, FormHelperText, Grid, MenuItem, TextField, Typography } from '@material-ui/core'; 
import { useLocation } from 'react-router-dom';
import Datatable from '../design/components/Datatable';
import { DatePicker, TimePicker } from '@material-ui/pickers';
import useStyles from './../Styles';
import { Autocomplete } from '@material-ui/lab';
import convertirAFecha from '../../../helpers/ConvertirAFecha';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import TooltipForTable from '../../../helpers/TooltipForTable';
import convertirAMoney from '../../../helpers/ConvertirAMoney';
import * as VARIABLES from './../../../types/variables';

const CambioServicio = () => {
    const appContext = useContext(AppContext);
    const { historialServicios, mediosPago, ordenesDeTrabajoAsignadas, servicios, usuarios, cambioServicioAbonado, traerTareas, traerServicios, traerServiciosAbonado, traerOnus, traerONUPorId,
    traerUsuariosPorRol, traerOrdenesDeTrabajoAsignadas, traerMediosPago } = appContext;

    const location = useLocation();
    const styles = useStyles();
    //Observables
    useEffect(() => {
        setMunicipioId(location.state.MunicipioId);
        traerTareas();
        traerServicios();
        traerOnus(5);
        traerServiciosAbonado(location.state.UserId);
        traerUsuariosPorRol(VARIABLES.ID_ROL_TECNICO);
        traerMediosPago();
    }, [])
    //States
    const [CambioServicioInfo, setCambioServicioInfo] = useState({
        UserId: location.state.UserId,
        CambioServicioObservaciones: null,
        createdBy: localStorage.getItem('identity')
    })
    const [MunicipioId, setMunicipioId] = useState(null);
    const onInputChange = (e) => {
        CambioServicioInfo({
            ...CambioServicioInfo,
            [e.target.name] : e.target.value
        });
    }
    const { UserId, createdBy, CambioServicioObservaciones} = CambioServicioInfo;
    const [Servicio, setServicio] = useState(null);
    const [ModalNuevoServicio, setModalNuevoServicio] = useState(false);
    const [OtFechaPrevistaVisita, setOtFechaPrevistaVisita] = useState(new Date());
    const [Tecnico, setTecnico] = useState(null);
    const [MedioPago, setMedioPago] = useState(null);
    const [OtObservacionesResponsableEmision, setOtObservacionesResponsableEmision] = useState(null);
    const [PagoInfo, setPagoInfo] = useState({
        Interes: null,
        Total: null,
        Inscripcion: null,
        Saldo: null
    });
    const onInputChangeObservacionesOt = (e) => {
        setOtObservacionesResponsableEmision(e.target.value);
    }
    const handleChangeServicioSeleccionado = (e) => {
        setServicio(e.target.value);
        setMedioPago(null);   
    }

    const handleChangeModalNuevoServicio = () => {
        setModalNuevoServicio(!ModalNuevoServicio);
    }
    const handleChangeMedioPagoSeleccionado = (e) => {
        setMedioPago(e.target.value);
        setPagoInfo({
            ...PagoInfo,
            Total: (Servicio.ServicioInscripcion + (Servicio.ServicioInscripcion*e.target.value.MedioPagoInteres / 100)).toFixed(2),
            Saldo: (Servicio.ServicioInscripcion/e.target.value.MedioPagoCantidadCuotas)
        });
    }
    const onSubmitAbonado = (e) => {
        e.preventDefault();
        if(location.state) {
            cambioServicioAbonado({
                UserId,
                Servicio,
                MunicipioId,
                CambioServicioObservaciones,
                createdBy,
                PagoInfo,
                MedioPago,
                Tecnico,
                OtFechaPrevistaVisita,
                OtObservacionesResponsableEmision
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
            "selector": row =>convertirAFecha(row["createdAt"]),
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
    const columnasOt = [
        {
            "name": "id",
            "selector": row => row["OtId"],
            "omit": true
        },
        {
            "name": <TooltipForTable name="Fecha prevista de visita" />,
            "wrap": true,
            "sortable": true,
            "selector": row => convertirAFecha(row["OtFechaPrevistaVisita"]),
        }  ,  
        {
            "name": "Domicilio",
            "wrap": true,
            "sortable": true,
            "selector": row => row["DomicilioCalle"] + ', ' + row["DomicilioNumero"] + ' | ' +  "Barrio " + row["BarrioNombre"] + ' | ' +  row["MunicipioNombre"],
        }    
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
    <Typography variant="h6">Historial de cambios de servicio del abonado: {location.state.Apellido}, {location.state.Nombre}</Typography>
    <br/>
    <Card>
        <CardHeader
            action={<Button onClick={setModalNuevoServicio} startIcon={<i className="bx bx-plus"></i>} variant="contained" color="primary">Nuevo servicio</Button>}>
        </CardHeader>
        <CardContent>
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
            Confirmar</Button>
        <Button onClick={handleChangeModalNuevoServicio}>Cancelar</Button></>}
        formulario={
            <>
            <Tabs>
            <TabList>
                <Tab><i className="bx bx-info-square"></i> Datos del servicio contratado</Tab>
                <Tab><i className="bx bx-plug"></i> Datos del nuevo servicio</Tab>
                <Tab><i className="bx bx-task"></i> Datos de la OT</Tab>
            </TabList>
            <TabPanel>
            <br/>
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
                            <Typography variant="h6"><b>Fecha de contrato: </b> {convertirAFecha(location.state.FechaContrato)}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            </TabPanel>
            <TabPanel>
            <br/>
            <Grid container spacing={3}>
                <Grid item xs={6} md={4} lg={4} xl={4}>
                    <TextField
                    variant="outlined"
                    onChange={handleChangeServicioSeleccionado}
                    value={Servicio}
                    label="Nuevo Servicio"
                    fullWidth
                    select
                    >
                    {servicios
                    .filter(servicio => servicio.ServicioId !== location.state.ServicioId)
                    .map((servicio)=>(
                        <MenuItem key={servicio.ServicioId} value={servicio}>{servicio.ServicioNombre} - ${servicio.ServicioInscripcion}</MenuItem>
                    ))}
                    </TextField>
                </Grid>
                {Servicio !== null
                    ?
                    <>
                    <Grid item xs={6} md={6} lg={6} xl={6}>
                    <TextField
                        variant = "outlined"
                        value={MedioPago}
                        onChange={handleChangeMedioPagoSeleccionado}
                        label="Medio de Pago de Inscripción"
                        fullWidth
                        select
                        >
                        {Servicio.ServicioId !== 1 ? mediosPago.map((mp)=>(
                            <MenuItem key={mp.MedioPagoId} value={mp}>{mp.MedioPagoNombre}</MenuItem>
                        )): mediosPago //Quitamos Facilidad de Pago si es Cable el servicio elegido
                        .filter((mp)=>mp.MedioPagoId !== 10)
                        .map((mp)=>(
                            <MenuItem key={mp.MedioPagoId} value={mp}>{mp.MedioPagoNombre}</MenuItem>
                        ))}
                    </TextField>
                    </Grid>
                    </>
                : "" }
                { Servicio !== null && MedioPago !== null
                    ?
                    <>
                    <Grid item xs={12} md={2} lg={2} xl={2}>
                        <TextField
                            variant="outlined"
                            value={PagoInfo.Interes * Servicio.ServicioInscripcion}
                            label={"Interés del total: (" + MedioPago.MedioPagoInteres +"%)"}
                            fullWidth
                            >
                        </TextField>
                    </Grid>
                    <br/>
                    <Grid item xs={12} md={12} sm={12}>
                        <Typography variant="h2"><b>Precio Final (Precio Inscripción + Interés {MedioPago.MedioPagoInteres} %):</b> ${convertirAMoney(PagoInfo.Total)}</Typography>
                        {MedioPago.MedioPagoId === 10 ? 
                        <Typography variant="h2"><b>Saldo restante por facilidad de pago:</b> ${PagoInfo.Saldo}</Typography> : "" }
                    </Grid>
                    </>
                :""}
                
            </Grid>
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
            </TabPanel>
            <TabPanel>
            <br/>
                <Grid container spacing={3}>
                    <Grid item xs={6} md={6} lg={6} xl={6}>
                        <DatePicker
                            inputVariant="outlined"
                            value={OtFechaPrevistaVisita}
                            onChange={(fecha)=>setOtFechaPrevistaVisita(fecha)}
                            format="dd/MM/yyyy"
                            fullWidth
                            label="Fecha prevista de visita"
                            >
                        </DatePicker>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6} xl={6}>
                    <Autocomplete
                        value={Tecnico}
                        onChange={(_event, newTecnico) => {
                            traerOrdenesDeTrabajoAsignadas(newTecnico.UserId, 5);
                            setTecnico(newTecnico);
                        }}
                        options={usuarios}
                        noOptionsText="No se encontraron técnicos"
                        getOptionLabel={(option) => option.Nombre +", "+ option.Apellido}
                        renderInput={(params) => <TextField {...params} variant ="outlined" fullWidth label="Técnico encargado de ejecución"/>}
                    />
                    </Grid>
                    { Tecnico !== null?
                    <Grid item xs={12} md={12} lg={12} xl={12}>
                        <Typography variant="h6">Órdenes de trabajo pendientes y asignadas a: {Tecnico.Nombre}, {Tecnico.Apellido}</Typography>
                        <br/>
                        <Card>
                            <CardContent>
                            <Datatable
                                datos={ordenesDeTrabajoAsignadas}
                                columnas={columnasOt}>
                            </Datatable>
                            </CardContent>
                        </Card>
                    </Grid>
                    : ""}
                    <Grid item xs={12} md={4} lg={4} xl={4}>
                            <TextField
                            disabled
                            variant="filled"
                            value={localStorage.getItem('usr')}
                            fullWidth
                            label="Responsable de emisión de OT">
                            </TextField>
                        </Grid>
                        <Grid item xs={6} md={4} lg={4} xl={4}>
                            <DatePicker
                                disabled
                                value={new Date()}
                                format="dd/MM/yyyy"
                                inputVariant="filled"
                                fullWidth
                                label="Fecha de emisión de OT"
                            ></DatePicker>
                        </Grid>
                        <Grid item xs={6} md={4} lg={4} xl={4}>
                            <TimePicker
                                value={new Date()}
                                disabled
                                inputVariant="filled"
                                fullWidth
                                label="Hora de emisión de OT"
                            ></TimePicker>
                        </Grid>
                        <Grid item xs={12} md={12} lg={12} xl={12}>
                            <TextField
                            variant = "outlined"
                            multiline
                            minRows={3}
                            value={OtObservacionesResponsableEmision}
                            name="OtObservacionesResponsableEmision"
                            inputProps={{
                                maxLength: 1000
                            }}
                            onChange={onInputChangeObservacionesOt}
                            fullWidth
                            label="Observaciones registro de OT">
                            </TextField>
                        </Grid>
                </Grid>
            </TabPanel>
            </Tabs>
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