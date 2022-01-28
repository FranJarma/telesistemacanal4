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
import BotonesDatatable  from './../design/components/BotonesDatatable';

const ListaPagos = () => {
    const appContext = useContext(AppContext);
    const { pagos, detallesPago, mediosPago, crearPago, agregarRecargo, eliminarRecargo, eliminarDetallePago, traerPagosPorAbonado, traerDetallesPago, traerMediosPago } = appContext;

    const location = useLocation();

    const [PagoPeriodo, setPagoPeriodo] = useState(new Date());
    const [PagoAño, setPagoAño] = useState(new Date());

    const [PagoInfo, setPagoInfo] = useState({
        PagoId: null,
        PagoMes: null,
        PagoAño: null,
        UserId: location.state.UserId,
        MedioPagoId: 1,
        PagoRecargo: null,
        PagoTotal: location.state.ServicioPrecioUnitario,
        DetallePagoId: '',
        DetallePagoFecha: new Date(),
        DetallePagoMonto: '',
        DetallePagoObservaciones: '',
        createdBy: null,
        updatedAt: null,
        updatedBy: null,
        deletedBy: null,
        deletedAt: null
    });

    const { DetallePagoMonto, DetallePagoObservaciones } = PagoInfo;

    const [ModalRecargo, setModalRecargo] = useState(false);
    const [ModalNuevoPago, setModalNuevoPago] = useState(false);
    const [ModalDetallesPago, setModalDetallesPago] = useState(false);
    const [ModalEliminarDetallePago, setModalEliminarDetallePago] = useState(false);
    const [HabilitarPeriodoPago, setHabilitarPeriodoPago] = useState(true);

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
    const handleChangeModalNuevoPago = (data, edit = false) => {
        if(!edit) {
            setPagoInfo({
                ...PagoInfo,
                createdBy: sessionStorage.getItem('identity')
            });
            setHabilitarPeriodoPago(true);
        }
        else {
            //setPagoInfo(data);
            setHabilitarPeriodoPago(false);
        }
        setModalNuevoPago(!ModalNuevoPago);
    }
    const handleChangeModalRecargoPago = (data) => {
        setPagoInfo({...data, updatedBy: sessionStorage.getItem('identity')});
        setModalRecargo(!ModalRecargo);

    }
    const handleChangeModalDetallesPago = (data) => {
        traerDetallesPago(data.PagoId);
        setModalDetallesPago(!ModalDetallesPago);
    }
    const handleChangeModalEliminarDetallePago = (data) => {
        setPagoInfo({...data, deletedBy: sessionStorage.getItem('identity'), deletedAt: new Date() });
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
            "selector": row => row["PagoRecargo"] > 0 ? <> <Typography style={{color: 'red'}}>$ {row["PagoRecargo"]} </Typography></> : "-",
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
                    <Typography onClick={()=>handleChangeModalRecargoPago(data)} style={{textDecoration: 'none', color: "darkorange", cursor: "pointer"}}><i className='bx bxs-error-alt bx-xs'></i> Añadir recargo</Typography>
                </MenuItem>
                <MenuItem>
                    <Typography onClick={()=>eliminarRecargo(data)} style={{textDecoration: 'none', color: "red", cursor: "pointer"}}><i className='bx bxs-trash bx-xs'></i> Eliminar recargo</Typography>
                </MenuItem>
                <MenuItem>
                    <Typography onClick={()=>handleChangeModalDetallesPago(data)} style={{textDecoration: 'none', color: "navy", cursor: "pointer"}}><i className='bx bx-list-ol bx-xs'></i> Detalles</Typography>
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
            "name": "Fecha de registro ",
            "selector": row =>row["createdAt"].split('T')[0].split('-').reverse().join('-'),
            "wrap": true,
            "sortable": true,
        },
        {
            "name": "Registrado por ",
            "selector": row =>row["Nombre"] + ', ' + row["Apellido"],
            "wrap": true,
            "sortable": true,
        },
        {
            "name": "Forma de pago",
            "selector": row => row["MedioPagoNombre"],
            "wrap": true,
            "sortable": true,
        },
        {
            cell: (data) => 
            <>
            <Typography onClick={()=>{handleChangeModalNuevoPago(data, true)}} style={{color: "teal", cursor: 'pointer'}}><Tooltip title="Editar"><i className="bx bxs-pencil bx-xs"></i></Tooltip></Typography>
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
                {location.pathname.split('/')[2] !== 'view' ?
                <CardHeader
                    action={<Button variant="contained" color="primary" onClick={handleChangeModalNuevoPago}>+ Asentar pago</Button>}>
                </CardHeader>
                :""}
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
                                setPagoPeriodo(nuevoAño);
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
                        disabled ={!HabilitarPeriodoPago ? true : false}
                        >
                        </DatePicker>
                </Grid>
                    <Grid item xs={6} md={6} sm={6} lg={6}>
                        <TextField
                            variant="outlined"
                            label="Recibido"
                            onKeyPress={(e) => {
                            if (!/^[.0-9]+$/.test(e.key)) {
                                e.preventDefault();
                            }}}
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
                abrirModal={ModalRecargo}
                funcionCerrar={handleChangeModalRecargoPago}
                botones={
                <>
                <Button onClick={()=>
                    {
                    agregarRecargo(PagoInfo, handleChangeModalRecargoPago)}}
                    variant="contained"
                    color="primary">
                    Aceptar</Button>
                <Button onClick={handleChangeModalRecargoPago}>Cerrar</Button></>}
                formulario={
                <>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={12} sm={12} lg={12}>
                        <Alert severity='info'>
                            <b>Avisos:</b>
                            <Typography>Agregar recargo sólamente si el abonado viene a pagar después del <b>21/{new Date().getMonth()+1}/{new Date().getFullYear()} </b>
                            ó si viene a pagar un mes anterior al actual.</Typography>
                            <Typography>El recargo es <b>acumulativo</b>, por lo tanto, cada registro irá acumulando el recargo ya existente.</Typography>
                        </Alert>
                        <br/>
                        <TextField
                            onKeyPress={(e) => {
                            if (!/^[,0-9]+$/.test(e.key)) {
                                e.preventDefault();
                            }}}
                            name="PagoRecargo"
                            fullWidth
                            variant="outlined"
                            label="Recargo por pago fuera de término ($)"
                            value={PagoInfo.PagoRecargo}
                            onChange={onInputChange}
                        ></TextField>
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
                        <br/>
                        <hr/>
                        <Typography variant="h2">Total pagado en el mes: ${ detallesPago.map(item => item.DetallePagoMonto).reduce((prev, curr) => prev + curr, 0)}</Typography>
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