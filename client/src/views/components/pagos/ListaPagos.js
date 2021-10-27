import React, { useState, useContext, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, FormHelperText, Grid, MenuItem, TextField, Tooltip, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import Datatable from '../design/components/Datatable';
import Aside from '../design/layout/Aside';
import { useLocation } from 'react-router-dom';
import Footer from '../design/layout/Footer';
import Modal from '../design/components/Modal';
import { DatePicker } from '@material-ui/pickers';
import AppContext from '../../../context/appContext';
import { Link } from "react-router-dom";

const ListaPagos = () => {
    const appContext = useContext(AppContext);
    const { pago, pagos, detallesPago, mediosPago, crearPago, traerPagosPorAbonado, traerPago, traerDetallesPago, traerMediosPago } = appContext;

    const location = useLocation();

    const [DiaActual, setDiaActual] = useState(new Date().getDate());

    const [PagoInfo, setPagoInfo] = useState({
        UserId: location.state.UserId,
        DetallePagoFecha: new Date(),
        DetallePagoMonto: '',
        DetallePagoObservaciones: '',
        MedioPagoId: 1,
        PagoRecargo: DiaActual >=21 ? 50 : 0,
        PagoTotal: DiaActual >= 21 ? location.state.ServicioPrecioUnitario + 50 : location.state.ServicioPrecioUnitario
    });

    const [PagoPeriodo, setPagoPeriodo] = useState(new Date());
    const { PagoRecargo, DetallePagoMonto, DetallePagoObservaciones } = PagoInfo;

    const [modalNuevoPago, setModalNuevoPago] = useState(false);
    const [modalDetallesPago, setModalDetallesPago] = useState(false);
    
    useEffect(()=>{
        traerPago(location.state.UserId, PagoPeriodo.toJSON().split('T')[0].split('-')[1] + '-' +PagoPeriodo.toJSON().split('T')[0].split('-')[0]);
        traerMediosPago();
        traerPagosPorAbonado(location.state.UserId);
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
    const handleChangeNuevoPago = () => {
        setModalNuevoPago(!modalNuevoPago);
        if(!modalNuevoPago){
            setPagoInfo({
                ...PagoInfo,
                UserId: location.state.UserId,
            })
        }
        else {
            setPagoInfo({
                ...PagoInfo,
                DetallePagoMonto: '',
                DetallePagoObservaciones: ''
            })
        }
    }
    const handleChangeModalDetallesPago = (data) => {
        traerDetallesPago(data.PagoId);
        setModalDetallesPago(!modalDetallesPago);
    }
    
    const columnasPagos = [
        {
            "name": "N°",
            "selector": row => row["PagoId"],
            "omit": true
        },
        {
            "name": "Periodo",
            "selector": row => row["PagoPeriodo"],
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
            "name": "Completo",
            "selector": row => row["PagoSaldo"] === 0 ? <i style={{color: 'green'}} className="bx bx-check bx-md"></i> :<><i style={{color: 'red'}} className="bx bx-x bx-md"></i><Typography><b>Saldo:</b> ${row["PagoSaldo"]}</Typography></>,
            "wrap": true
        },
        {
            cell: (data) =>
            <>
            <Typography onClick={()=>handleChangeModalDetallesPago(data)} style={{textDecoration: 'none', color: "navy", cursor: "pointer"}}><Tooltip title="Detalles de pago del período"><i className='bx bx-list-ol bx-sm'></i></Tooltip></Typography>
            <Link to={{
                pathname: `/caratula-abonado/abonadoId=${data.id}`,
                state: data
            }} style={{textDecoration: 'none', color: "teal"}}><Tooltip title="Generar factura"><i className="bx bxs-file-pdf bx-sm"></i></Tooltip></Link>
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
            <Typography onClick={()=>{handleChangeNuevoPago(data)}} style={{color: "teal", cursor: 'pointer'}}><Tooltip title="Editar"><i className="bx bxs-edit bx-xs"></i></Tooltip></Typography>
            <Typography style={{color: "slategrey", cursor: 'pointer'}}><Tooltip title="Generar recibo"><i className="bx bxs-receipt bx-xs"></i></Tooltip></Typography>
            </>,
        }
    ]

    return (
        <>
        <div className="container">
        <Aside/>
        <main>
        <Card>
            <CardContent>
                <CardHeader
                    action={<Button variant="contained" color="primary" onClick={handleChangeNuevoPago}>+ Asentar pago</Button>}>
                </CardHeader>
                <Typography variant="h1">Historial de pagos de: {location.state.Apellido}, {location.state.Nombre}</Typography>
                <Datatable
                    columnas={columnasPagos}
                    datos={pagos}
                    paginacion={true}
                    buscar={true}
                />
                <Modal
                abrirModal={modalNuevoPago}
                funcionCerrar={handleChangeNuevoPago}
                botones={
                <>
                <Button onClick={()=>
                    {
                    crearPago(
                        {...PagoInfo,
                        PagoPeriodo
                    })}}
                    variant="contained"
                    color="primary">
                    Aceptar</Button>
                <Button onClick={handleChangeNuevoPago}>Cerrar</Button></>}
                formulario={
                <>
                <Typography style={{marginTop: '0px'}} variant="h2"><i className="bx bx-dollar"></i> Datos del pago</Typography>
                <Alert severity="info">
                    {DiaActual >= 21 ? 
                    <Typography variant="h6"><b>Total por servicio ({location.state.ServicioNombre}):</b> ${location.state.ServicioPrecioUnitario} + <b>Recargo: </b> $ {PagoRecargo} = ${location.state.ServicioPrecioUnitario + PagoRecargo}</Typography>
                    : <Typography variant="h6"><b>Total por servicio ({location.state.ServicioNombre}):</b> ${location.state.ServicioPrecioUnitario}</Typography>
                }
                </Alert>
                <br/>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={12} sm={12} lg={12}>
                        <DatePicker
                        inputVariant="outlined"
                        value={PagoPeriodo}
                        onChange={(periodo)=>{
                            setPagoPeriodo(periodo)
                            traerPago(location.state.UserId, periodo.toJSON().split('T')[0].split('-')[1] + '-' +periodo.toJSON().split('T')[0].split('-')[0]);
                        }}
                        fullWidth
                        views={["year", "month"]}
                        label="Período de Pago"
                        disableFuture
                        >
                        </DatePicker>
                        {pago.length > 0 ? <FormHelperText style={{color: 'teal'}}>Saldo del mes seleccionado: ${pago[0].PagoSaldo}</FormHelperText>: ""}
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
                abrirModal={modalDetallesPago}
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
            </CardContent>
        </Card>
        </main>
        <Footer/>
        </div>
        </>
    );
}
 
export default ListaPagos;