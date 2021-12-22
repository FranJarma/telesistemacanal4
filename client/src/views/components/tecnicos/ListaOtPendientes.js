import React, { useState, useContext, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, Grid, List, ListItem, ListItemIcon, TextField, Tooltip, Typography } from '@material-ui/core';
import Datatable from '../design/components/Datatable';
import Aside from '../design/layout/Aside';
import Footer from '../design/layout/Footer';
import Modal from '../design/components/Modal';
import AppContext from '../../../context/appContext';
import { Link } from 'react-router-dom';
import CaratulaImpresionOt from './CaratulaImpresionOt';
import { DatePicker, TimePicker } from '@material-ui/pickers';
import { Alert } from '@material-ui/lab';

const ListaOtPendientes = () => {
    const appContext = useContext(AppContext);
    const { ordenesDeTrabajo, traerOrdenesDeTrabajo, registrarVisitaOrdenDeTrabajo} = appContext;

    useEffect(()=>{
        traerOrdenesDeTrabajo();
    },[])

    const [ModalImprimirOt, setModalImprimirOt] = useState(false);
    const [ModalRegistrarVisitaOt, setModalRegistrarVisitaOt] = useState(false);
    const [ModalFinalizarOt, setModalFinalizarOt] = useState(false);
    const [ModalEliminarOt, setModalEliminarOt] = useState(false);

    const [OtInfo, setOtInfo] = useState({})

    const [FechaVisita, setFechaVisita] = useState(new Date());
    const [HoraInicio, setHoraInicio] = useState(new Date());
    const [HoraFinalizacion, setHoraFinalizacion] = useState(new Date());

    const handleChangeModalImprimirOt = (data = '') => {
        if(!ModalImprimirOt) {
            setOtInfo(data);
            setModalImprimirOt(true);
        }
        else {
            setOtInfo('');
            setModalImprimirOt(false);
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
    const handleChangeModalEliminarOt = (data = '') => {
        if(!ModalEliminarOt) {
            setOtInfo(data);
            setModalEliminarOt(true);
        }
        else {
            setOtInfo('');
            setModalEliminarOt(false);
        }
    }

    const columnasOt = [
        {
            "name": "id",
            "selector": row => row["OtId"],
            "omit": true
        },
        {
            "name": "Abonado",
            "wrap": true,
            "selector": row => row["ApellidoAbonado"] + ", " + row["NombreAbonado"]
        },
        {
            "name": "Domicilio",
            "wrap": true,
            "selector": row => row["DomicilioCalle"] + " " + row["DomicilioNumero"]
        },
        {
            "name": "Monto",
            "wrap": true,
            "selector": row => "$ " + row["Monto"]
        },
        {
            "name": "Observaciones",
            "wrap": true,
            "selector": row => row["OtObservacionesResponsableEmision"] ? row["OtObservacionesResponsableEmision"] : "-",
        },        
        {
            cell: (data) => 
            <>
            <Link to={{
                pathname: `/caratula-ot/edit/OtId=${data.OtId}`,
                state: data
            }}
            style={{textDecoration: 'none', color: "teal"}}>
            <Tooltip title="Editar"><i className='bx bxs-pencil bx-xs' ></i></Tooltip>
            </Link>
            <Typography onClick={()=>{handleChangeModalRegistrarVisitaOt(data)}} style={{color: "navy", cursor: 'pointer'}}><Tooltip title="Registrar visita"><i className='bx bxs-calendar bx-xs' ></i></Tooltip></Typography>
            <Typography onClick={()=>{handleChangeModalFinalizarOt(data)}} style={{color: "navy", cursor: 'pointer'}}><Tooltip title="Finalizar OT"><i className='bx bx-calendar-check bx-xs' ></i></Tooltip></Typography>
            <Typography onClick={()=>{handleChangeModalImprimirOt(data)}} style={{color: "orange", cursor: 'pointer'}}><Tooltip title="Imprimir"><i className="bx bx-printer bx-xs"></i></Tooltip></Typography>
            <Typography onClick={()=>{handleChangeModalEliminarOt(data)}} style={{color: "red", cursor: 'pointer'}}><Tooltip title="Eliminar"><i className="bx bx-trash bx-xs"></i></Tooltip></Typography>
            </>,
        }
    ]
    return (
        <>
        <div className="container">
        <Aside/>
        <main>
        <Card>
            <CardHeader action={<Link style={{textDecoration: 'none'}} to="/caratula-ot"><Button variant="contained" color="primary">+ Nueva OT</Button></Link>}></CardHeader>
            <CardContent>
                <Typography variant="h1">Listado de Órdenes de Trabajo sin finalizar</Typography>
                <Datatable
                    loader={true}
                    datos={ordenesDeTrabajo}
                    columnas={columnasOt}
                    paginacion={true}
                    buscar={true}
                />
            </CardContent>
        </Card>
            <Modal
            abrirModal={ModalImprimirOt}
            funcionCerrar={handleChangeModalImprimirOt}
            formulario={<CaratulaImpresionOt datos={OtInfo}/>}
            ></Modal>
            <Modal
            abrirModal={ModalRegistrarVisitaOt}
            funcionCerrar={handleChangeModalRegistrarVisitaOt}
            titulo ={<Typography variant="h2"><i className="bx bxs-calendar"></i> Registrar Visita OT</Typography>}
            botones={<><Button variant='contained' color="primary" onClick={() => registrarVisitaOrdenDeTrabajo({...OtInfo, FechaVisita}, handleChangeModalRegistrarVisitaOt)}>Registrar</Button><Button variant="text" color="inherit" onClick={handleChangeModalRegistrarVisitaOt}>Cerrar</Button></>}
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
            botones={<><Button variant='contained' color="primary">Registrar</Button><Button variant="text" color="inherit" onClick={handleChangeModalFinalizarOt}>Cerrar</Button></>}
            formulario={
                <>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={12} lg={12} xl={12}>
                        <DatePicker
                        inputVariant="outlined"
                        value={FechaVisita}
                        onChange={(fecha)=>setFechaVisita(fecha)}
                        format="dd/MM/yyyy"
                        fullWidth
                        label="Fecha de Finalización"
                        ></DatePicker>
                    </Grid>
                    <Grid item xs={12} md={12} lg={12} xl={12}>
                        <TimePicker
                        inputVariant="outlined"
                        value={HoraInicio}
                        onChange={(hora)=>setHoraInicio(hora)}
                        fullWidth
                        label="Hora de Inicio"
                        ></TimePicker>
                    </Grid>
                    <Grid item xs={12} md={12} lg={12} xl={12}>
                        <TimePicker
                        inputVariant="outlined"
                        value={HoraFinalizacion}
                        onChange={(hora)=>setHoraFinalizacion(hora)}
                        fullWidth
                        label="Hora de Finalización"
                        ></TimePicker>
                    </Grid>
                    <Grid item xs={12} md={12} lg={12} xl={12}>
                        <TextField
                        variant = "outlined"
                        multiline
                        minRows={3}
                        // value={CambioDomicilioObservaciones}
                        name="CambioDomicilioObservaciones"
                        inputProps={{
                            maxLength: 1000
                        }}
                        // onChange={onInputChange}
                        fullWidth
                        label="Observaciones">
                        </TextField>
                    </Grid>
                </Grid>
                </>}
            >
            </Modal>
            <Modal
            abrirModal={ModalEliminarOt}
            funcionCerrar={handleChangeModalEliminarOt}
            titulo={<Alert severity="error">¿Está seguro que quiere eliminar la orden de trabajo?</Alert>}
            botones={
                <>
                <Button variant="contained" color="secondary" onClick={()=>{}}>Eliminar</Button>
                <Button variant="text" color="inherit">Cerrar</Button>
                </>
            }
            />
        </main>
        <Footer/>
        </div>
        </>
    );
}
 
export default ListaOtPendientes;