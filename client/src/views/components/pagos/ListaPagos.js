import React, { useState, useContext, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, Grid,  MenuItem, TextField, Tooltip, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import Datatable from '../design/components/Datatable';
import Aside from '../design/layout/Aside';
import { useLocation } from 'react-router-dom';
import Footer from '../design/layout/Footer';
import Modal from '../design/components/Modal';
import { DatePicker } from '@material-ui/pickers';
import AppContext from '../../../context/appContext';
import  BotonesDatatable  from './../design/components/BotonesDatatable';

const ListaPagos = () => {
    const appContext = useContext(AppContext);
    const { usuarioLogueado, pago, pagos, detallesPago, mediosPago, crearPago, eliminarDetallePago, traerPagosPorAbonado, traerPago, traerDetallesPago, traerMediosPago } = appContext;

    const location = useLocation();

    const [FechaActual, setFechaActual] = useState({
        diaActual: new Date().getDate(),
        mesActual: new Date().getMonth() + 1 //+1 debido que getMonth comienza en 0
    })

    const [PagoPeriodo, setPagoPeriodo] = useState(new Date());
    const [PagoAño, setPagoAño] = useState(new Date());

    const [PagoInfo, setPagoInfo] = useState({
        UserId: location.state.UserId,
        DetallePagoId: '',
        DetallePagoFecha: new Date(),
        DetallePagoMonto: '',
        DetallePagoObservaciones: '',
        MedioPagoId: 1,
        /*Sólo se cobrara recargo si el abonado paga después del 21 del mismo mes O si paga despues del mes seleccionado.
        POR EJ: hoy 3 de Noviembre, si quiero pagar OCTUBRE, me recargan¨*/
        PagoRecargo: (FechaActual.diaActual >= 21 && FechaActual.mesActual === PagoPeriodo.getMonth()+1)
        || (FechaActual.mesActual > PagoPeriodo.getMonth()+1)
        ? location.state.ServicioRecargo : 0,
        PagoTotal: (FechaActual.diaActual >= 21 && FechaActual.mesActual === PagoPeriodo.getMonth()+1)
        || (FechaActual.mesActual > PagoPeriodo.getMonth()+1)
        ? location.state.ServicioPrecioUnitario + location.state.ServicioRecargo : location.state.ServicioPrecioUnitario,
        createdBy: null,
        updatedAt: null,
        updatedBy: null,
        deletedBy: null,
        deletedAt: null
    });

    const { DetallePagoMonto, DetallePagoObservaciones } = PagoInfo;

    const [ModalNuevoPago, setModalNuevoPago] = useState(false);
    const [ModalDetallesPago, setModalDetallesPago] = useState(false);
    const [ModalEliminarDetallePago, setModalEliminarDetallePago] = useState(false);

    useEffect(()=>{
        traerMediosPago();
        traerPagosPorAbonado(location.state.UserId, PagoAño.getFullYear());
    },[]);

    const onInputChange = (e) => {
        setPagoInfo({
            ...PagoInfo,
            [e.target.name] : e.target.value
        });
    }
    const handleChangeMedioPagoId = (e) => {
        setPagoInfo({
            ...PagoInfo,
            MedioPagoId: e.target.value});
    }
    const handleChangeModalNuevoPago = (data) => {
        setPagoInfo({
            ...PagoInfo,
            createdBy: usuarioLogueado.User.UserId
        })
        setModalNuevoPago(!ModalNuevoPago);
    }
    const handleChangeModalDetallesPago = (data) => {
        traerDetallesPago(data.PagoId);
        setModalDetallesPago(!ModalDetallesPago);
    }
    const handleChangeModalEliminarDetallePago = (data) => {
        setPagoInfo({...data, deletedBy: usuarioLogueado.User.UserId, deletedAt: new Date() });
        setModalEliminarDetallePago(!ModalEliminarDetallePago);
    }
    
    const columnasPagos = [
        {
            "name": "N°",
            "selector": row => row["PagoId"],
            "omit": true
        },
        {
            "name": "Periodo",
            "selector": row => row["PagoMes"] + "/" + row["PagoAño"],
            "sortable": true,
            "wrap": true
        },
        {
            "name": "Total",
            "selector": row => "$ " + row["PagoTotal"],
            "sortable": true,
            "wrap": true
        },
        {
            "name": "Recargo",
            "selector": row => "$ " + row["PagoRecargo"],
            "sortable": true,
            "wrap": true
        },
        {
            "name": "Completo",
            "selector": row => row["PagoSaldo"] === 0 ? <i style={{color: 'green'}} className="bx bx-check bx-md"></i> :<><i style={{color: 'red'}} className="bx bx-x bx-md"></i><Typography><b>Saldo:</b> ${row["PagoSaldo"]}</Typography></>,
            "wrap": true
        },
        {
            cell: (data) =>
            <>
            <BotonesDatatable botones={
                <>
                <MenuItem>
                    <Typography onClick={()=>handleChangeModalNuevoPago(data)} style={{textDecoration: 'none', color: "teal", cursor: "pointer"}}><i className='bx bxs-pencil bx-xs'></i> EDITAR</Typography>
                </MenuItem>
                <MenuItem>
                    <Typography onClick={()=>handleChangeModalDetallesPago(data)} style={{textDecoration: 'none', color: "navy", cursor: "pointer"}}><i className='bx bx-list-ol bx-xs'></i> DETALLES DEL MES</Typography>
                </MenuItem>
                </>
            }/>
            </>,
        }
    ]

    const columnasDetallesPagos = [
        {
            "name": "N°",
            "selector": row =>row["DetallePagoId"],
            "omit": true
        },
        {
            "name": "Monto",
            "selector": row =>"$" + row["DetallePagoMonto"],
            "sortable": true,
            "wrap": true
        },
        {
            "name": "Fecha ",
            "selector": row =>row["DetallePagoFecha"].split('T')[0].split('-').reverse().join('-'),
            "wrap": true,
            "width": "10rem",
            "sortable": true,
        },
        {
            "name": "Forma de pago",
            "selector": row => row["MedioPagoNombre"],
            "wrap": true,
            "width": "10rem",
            "sortable": true,
        },
        {
            cell: (data) => 
            <>
            {/* <Typography style={{color: "slategrey", cursor: 'pointer'}}><Tooltip title="Generar recibo"><i className="bx bxs-receipt bx-xs"></i></Tooltip></Typography> */}
            <Typography onClick={()=>{handleChangeModalEliminarDetallePago(data)}} style={{color: "red", cursor: 'pointer'}}><Tooltip title="Eliminar"><i className="bx bx-trash bx-xs"></i></Tooltip></Typography>
            </>,
        }
    ]

    return (
        <>
        <div className="container">
        <Aside/>
        <main>
        <br/>
        <Card>
            <CardContent>
                <CardHeader
                    action={<Button variant="contained" color="primary" onClick={handleChangeModalNuevoPago}>+ Asentar pago</Button>}>
                </CardHeader>
                <Typography variant="h1">Historial de pagos de: {location.state.Apellido}, {location.state.Nombre}</Typography>
                <br/>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={2} lg={2}>
                        <DatePicker
                            color="primary"
                            inputVariant="outlined"
                            format="yyyy"
                            views={["year"]}
                            fullWidth
                            disableFuture
                            disableToolbar
                            label="Año"
                            onChange={nuevoAño => {
                                setPagoAño(nuevoAño);
                                traerPagosPorAbonado(location.state.UserId, nuevoAño.getFullYear());
                            }}
                            value={PagoAño}
                        ></DatePicker>
                    </Grid>
                </Grid>
                <Datatable
                    loader={true}
                    columnas={columnasPagos}
                    datos={pagos}
                    paginacion={true}
                    buscar={true}
                />
                <Modal
                abrirModal={ModalNuevoPago}
                funcionCerrar={handleChangeModalNuevoPago}
                botones={
                <>
                <Button onClick={()=>
                    {
                    crearPago(
                        {...PagoInfo,
                        PagoPeriodo
                    }, handleChangeModalNuevoPago)}}
                    variant="contained"
                    color="primary">
                    Aceptar</Button>
                <Button onClick={handleChangeModalNuevoPago}>Cerrar</Button></>}
                formulario={
                <>
                <Typography style={{marginTop: '0px'}} variant="h2"><i className="bx bx-dollar"></i> Datos del pago</Typography>
                <Alert severity="info">
                    <Typography variant="h6"><b>Total por servicio ({location.state.ServicioNombre}):</b> ${location.state.ServicioPrecioUnitario}</Typography>
                </Alert>
                <br/>
                <Alert severity="warning">
                    <Typography variant="h6"><b>Recargo por pago fuera de término:</b> ${location.state.ServicioRecargo}</Typography>
                </Alert>
                <br/>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={12} sm={12} lg={12}>
                        <DatePicker
                        inputVariant="outlined"
                        value={PagoPeriodo}
                        onChange={(periodo)=>{
                            setPagoPeriodo(periodo)
                        }}
                        fullWidth
                        views={["year", "month"]}
                        label="Período de Pago"
                        disableFuture
                        >
                        </DatePicker>
                </Grid>
                    <Grid item xs={6} md={6} sm={6} lg={6}>
                        <TextField
                            variant="outlined"
                            label="Recibido"
                            type="number"
                            value={DetallePagoMonto}
                            name="DetallePagoMonto"
                            fullWidth
                            onChange={onInputChange}
                            >
                        </TextField>
                    </Grid>
                    <Grid item xs={6} md={6} sm={6} lg={6}>
                        <TextField
                            variant="outlined"
                            label="Medio de Pago"
                            value={PagoInfo.MedioPagoId}
                            name="MedioPagoId"
                            fullWidth
                            select
                            onChange={handleChangeMedioPagoId}
                            >
                            {mediosPago.map((mp)=>(
                                <MenuItem key={mp.MedioPagoId} value={mp.MedioPagoId}>{mp.MedioPagoNombre}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={12} sm={12} lg={12}>
                        <TextField
                            variant="outlined"
                            multiline
                            minRows={3}
                            label="Observaciones"
                            value={DetallePagoObservaciones}
                            name="DetallePagoObservaciones"
                            fullWidth
                            inputProps={{
                                maxLength: 100
                            }}
                            onChange={onInputChange}
                            >
                        </TextField>
                    </Grid>
                </Grid>
                <br/>
                <br/>
                </>}
                >
                </Modal>
                <Modal
                abrirModal={ModalDetallesPago}
                funcionCerrar={handleChangeModalDetallesPago}
                botones={
                <>
                <Button onClick={handleChangeModalDetallesPago}>Cerrar</Button></>}
                formulario={
                <>
                <Typography style={{marginTop: '0px'}} variant="h2"><i className="bx bx-list-ol"></i> Detalles de pago</Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={12} sm={12} lg={12}>
                        <Datatable
                        columnas={columnasDetallesPagos}
                        datos={detallesPago}
                        buscar={true}/>
                    </Grid>
                </Grid>
                <br/>
                </>}
                >
                </Modal>
                <Modal
                abrirModal={ModalEliminarDetallePago}
                funcionCerrar={handleChangeModalEliminarDetallePago}
                titulo={<Alert severity="error">¿Está seguro que quiere eliminar el pago realizado?</Alert>}
                botones={
                    <>
                    <Button variant="contained" color="secondary" onClick={()=>{eliminarDetallePago(PagoInfo, handleChangeModalEliminarDetallePago)}}>Eliminar</Button>
                    <Button variant="text" color="inherit" onClick={handleChangeModalEliminarDetallePago}>Cerrar</Button>
                    </>
                }
                />
            </CardContent>
        </Card>
        </main>
        <Footer/>
        </div>
        </>
    );
}
 
export default ListaPagos;