import React, { useState, useContext, useEffect } from 'react';
import { Button, Card, CardContent, Grid, List, ListItem, ListItemIcon, MenuItem, TextField, Typography } from '@material-ui/core';
import Datatable from '../design/components/Datatable';
import Aside from '../design/layout/Aside';
import Footer from '../design/layout/Footer';
import Modal from '../design/components/Modal';
import AppContext from '../../../context/appContext';
import CaratulaVerOt from './CaratulaVerOt';
import { DatePicker, KeyboardDateTimePicker } from "@material-ui/pickers";
import GetUserId from './../../../helpers/GetUserId';

import { Alert } from '@material-ui/lab';
import BotonesDatatable from '../design/components/BotonesDatatable';

const ListaMisOt = () => {
    const appContext = useContext(AppContext);
    const { ordenesDeTrabajoAsignadas, traerOrdenesDeTrabajoAsignadas, registrarVisitaOrdenDeTrabajo, finalizarOrdenDeTrabajo} = appContext;

    useEffect(()=>{
        traerOrdenesDeTrabajoAsignadas(GetUserId(), 5);
    },[]);

    const [ModalVerOt, setModalVerOt] = useState(false);
    const [ModalRegistrarVisitaOt, setModalRegistrarVisitaOt] = useState(false);
    const [ModalFinalizarOt, setModalFinalizarOt] = useState(false);

    const [OtInfo, setOtInfo] = useState({})

    const [OtObservacionesResponsableEjecucion, setOtObservacionesResponsableEjecucion] = useState("");
    const [FechaVisita, setFechaVisita] = useState(new Date());
    const [OtFechaInicio, setOtFechaInicio] = useState(new Date());
    const [OtFechaFinalizacion, setOtFechaFinalizacion] = useState(new Date());

    const onInputChange = (e) => {
        setOtObservacionesResponsableEjecucion(e.target.value);
    }

    const handleChangeModalVerOt = (data = '') => {
        if(!ModalVerOt) {
            setOtInfo(data);
            setModalVerOt(true);
        }
        else {
            setOtInfo('');
            setModalVerOt(false);
        }
    }
    const handleChangeModalRegistrarVisitaOt = (data = '') => {
        if(!ModalRegistrarVisitaOt) {
            setOtInfo({...data, 
            OtPrimeraVisita: data.OtPrimeraVisita ? data.OtPrimeraVisita.split('T')[0].split('-').reverse().join('/') : "",
            OtSegundaVisita: data.OtSegundaVisita ? data.OtSegundaVisita.split('T')[0].split('-').reverse().join('/') : "",
            OtTerceraVisita: data.OtTerceraVisita ? data.OtTerceraVisita.split('T')[0].split('-').reverse().join('/') : "",
            OtCuartaVisita: data.OtCuartaVisita ? data.OtCuartaVisita.split('T')[0].split('-').reverse().join('/') : ""
        });
            setModalRegistrarVisitaOt(true);
        }
        else {
            setOtInfo('');
            setModalRegistrarVisitaOt(false);
        }
    }
    const handleChangeModalFinalizarOt = (data = '') => {
        if(!ModalFinalizarOt) {
            setOtInfo(data);
            setModalFinalizarOt(true);
        }
        else {
            setOtInfo('');
            setModalFinalizarOt(false);
        }
    }

    const columnasMisOt = [
        {
            "name": "id",
            "selector": row => row["OtId"],
            "omit": true
        },
        {
            "name": "Abonado",
            "wrap": true,
            "sortable": true,
            "selector": row => row["ApellidoAbonado"] + ", " + row["NombreAbonado"]
        },
        {
            "name": "Domicilio",
            "wrap": true,
            "sortable": true,
            "selector": row => row["DomicilioCalle"] + ', ' + row["DomicilioNumero"] + ' | ' +  "Barrio " + row["BarrioNombre"] + ' | ' +  row["MunicipioNombre"],
        },
        {
            "name": "Monto",
            "wrap": true,
            "sortable": true,
            "selector": row => "$ " + row["Monto"]
        },
        {
            "name": "Observaciones",
            "wrap": true,
            "sortable": true,
            "selector": row => row["OtObservacionesResponsableEmision"] ? row["OtObservacionesResponsableEmision"] : "-",
        },        
        {
            cell: (data) => 
            <>
            <BotonesDatatable botones={
                <>
                <MenuItem>
                <Typography onClick={()=>{handleChangeModalVerOt(data)}} style={{color: "navy", cursor: 'pointer'}}><i className="bx bx-show-alt bx-xs"></i> Ver OT</Typography>
                </MenuItem>
                <MenuItem>
                    <Typography onClick={()=>{handleChangeModalRegistrarVisitaOt(data)}} style={{color: "palevioletred", cursor: 'pointer'}}><i className='bx bx-calendar bx-xs'> </i> Registrar visita</Typography>
                </MenuItem>
                <MenuItem>
                    <Typography onClick={()=>{handleChangeModalFinalizarOt(data)}} style={{color: "navy", cursor: 'pointer'}}><i className='bx bx-calendar-check bx-xs' ></i> Finalizar OT</Typography>
                </MenuItem>
                </>
            }/>
            </>,
        }
    ]
    return (
        <>
        <div className="container">
        <Aside/>
        <main>
        <Typography variant="h6">Mis órdenes de Trabajo</Typography>
        <br/>
        <Card>
            <CardContent>
                <Datatable
                    loader={true}
                    datos={ordenesDeTrabajoAsignadas}
                    columnas={columnasMisOt}
                    paginacion={true}
                    buscar={true}
                />
            </CardContent>
        </Card>
            <Modal
            abrirModal={ModalVerOt}
            funcionCerrar={handleChangeModalVerOt}
            titulo ={<Typography variant="h2"><i className="bx bx-clipboard"></i> Datos de OT N°: {OtInfo.OtId}</Typography>}
            formulario={<CaratulaVerOt datos={OtInfo}/>}
            ></Modal>
            <Modal
            abrirModal={ModalRegistrarVisitaOt}
            funcionCerrar={handleChangeModalRegistrarVisitaOt}
            titulo ={<Typography variant="h2"><i className="bx bx-calendar"></i> Registrar Visita OT</Typography>}
            botones={<><Button variant='contained' color="primary" onClick={() =>
                registrarVisitaOrdenDeTrabajo({...OtInfo, FechaVisita}, handleChangeModalRegistrarVisitaOt)}>Registrar</Button><Button variant="text" color="inherit" onClick={handleChangeModalRegistrarVisitaOt}>Cancelar</Button></>}
            formulario={
            <>
            <Grid container spacing ={3}>
            <Grid item xs={12} md={12} lg={12} xl={12}>
                <DatePicker
                inputVariant="outlined"
                value={OtInfo.OtFechaPrevistaVisita}
                disabled
                format="dd/MM/yyyy"
                fullWidth
                label="Fecha prevista de visita pactada"
                ></DatePicker>
                </Grid>
                <Grid item xs={12} md={12} lg={12} xl={12}>
                    <DatePicker
                    inputVariant="outlined"
                    value={FechaVisita}
                    onChange={(fecha)=>setFechaVisita(fecha)}
                    format="dd/MM/yyyy"
                    fullWidth
                    label="Fecha de Visita"
                    ></DatePicker>
                </Grid>
            </Grid>
            { OtInfo.OtPrimeraVisita ? <>
                <Typography variant="h2">Visitas anteriores:</Typography>
                <List>
                    <ListItem><ListItemIcon>1</ListItemIcon>{OtInfo.OtPrimeraVisita}</ListItem>
                    <ListItem><ListItemIcon>2</ListItemIcon>{OtInfo.OtSegundaVisita}</ListItem>
                    <ListItem><ListItemIcon>3</ListItemIcon>{OtInfo.OtTerceraVisita}</ListItem>
                    <ListItem><ListItemIcon>4</ListItemIcon>{OtInfo.OtCuartaVisita}</ListItem>
                </List>
                {OtInfo.OtTerceraVisita ? <Alert severity="info">La OT ya tiene 3 visitas realizadas por el técnico, se tiene que cobrar un monto adicional que se actualizará al monto de la OT</Alert> : ""}
                </>
            : ""}
            </>}
            ></Modal>
            <Modal
            abrirModal={ModalFinalizarOt}
            funcionCerrar={handleChangeModalFinalizarOt}
            titulo ={<Typography variant="h2"><i className="bx bx-calendar-check"></i> Finalizar OT</Typography>}
            botones={<><Button variant='contained' color="primary"
            onClick={() =>finalizarOrdenDeTrabajo({...OtInfo, OtFechaInicio, OtFechaFinalizacion, OtObservacionesResponsableEjecucion, updatedBy: GetUserId()},
            handleChangeModalFinalizarOt)}>Registrar</Button><Button variant="text" color="inherit" onClick={handleChangeModalFinalizarOt}>Cancelar</Button></>}
            formulario={
                <>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={12} lg={12} xl={12}>
                        <KeyboardDateTimePicker
                        disableToolbar
                        inputVariant="outlined"
                        value={OtFechaInicio}
                        format="dd/MM/yyyy HH:mm"
                        invalidDateMessage="Seleccione una fecha y hora válido"
                        onChange={(fecha)=>setOtFechaInicio(fecha)}
                        fullWidth
                        label="Fecha y hora de inicio"
                        />
                    </Grid>
                    <Grid item xs={12} md={12} lg={12} xl={12}>
                        <KeyboardDateTimePicker
                        disableToolbar
                        inputVariant="outlined"
                        value={OtFechaFinalizacion}
                        format="dd/MM/yyyy HH:mm"
                        invalidDateMessage="Seleccione una fecha y hora válido"
                        onChange={(fecha)=>setOtFechaFinalizacion(fecha)}
                        fullWidth
                        label="Fecha y hora de finalización"
                        ></KeyboardDateTimePicker>
                    </Grid>
                    <Grid item xs={12} md={12} lg={12} xl={12}>
                        <TextField
                        variant = "outlined"
                        multiline
                        minRows={3}
                        value={OtObservacionesResponsableEjecucion}
                        name="OtObservacionesResponsableEjecucion"
                        inputProps={{
                            maxLength: 1000
                        }}
                        onChange={onInputChange}
                        fullWidth
                        label="Observaciones">
                        </TextField>
                    </Grid>
                </Grid>
                </>}
            >
            </Modal>
        </main>
        <Footer/>
        </div>
        </>
    );
}
 
export default ListaMisOt;