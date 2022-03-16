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
import convertirAFecha from './../../../helpers/ConvertirAFecha';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

const ListaPagos = () => {
    const appContext = useContext(AppContext);
    const { pagos, detallesPago, mediosPago, conceptos, crearPago, agregarCuota, agregarRecargo, eliminarRecargo, eliminarDetallePago, traerPagosPorAbonado, traerDetallesPago, traerMediosPago, traerConceptos } = appContext;

    const location = useLocation();
    const [PagoPeriodo, setPagoPeriodo] = useState(null);
    const [PagoAño, setPagoAño] = useState(new Date());
    const [ConceptoId, setConceptoId] = useState(null);
    const [MunicipioId, setMunicipioId] = useState(location.state.MunicipioId);
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

    const [ModalAgregarCuota, setModalAgregarCuota] = useState(false);
    const [ModalRecargo, setModalRecargo] = useState(false);
    const [ModalNuevoPago, setModalNuevoPago] = useState(false);
    const [ModalDetallesPago, setModalDetallesPago] = useState(false);
    const [ModalEliminarDetallePago, setModalEliminarDetallePago] = useState(false);
    const [HabilitarPeriodoPago, setHabilitarPeriodoPago] = useState(true);

    useEffect(()=>{
        traerConceptos(1);
        traerMediosPago();
        traerPagosPorAbonado(location.state.UserId, PagoAño.getFullYear(), 2); //trae por defecto el 1er tab
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
    const handleChangeConceptoId = (e) => {
        setConceptoId(e.target.value);
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
        setPagoInfo({...data, updatedBy: sessionStorage.getItem('identity')});
        setModalDetallesPago(!ModalDetallesPago);
    }
    const handleChangeModalAgregarCuota = (data) => {
        traerDetallesPago(data.PagoId);
        setPagoInfo({...data, updatedBy: sessionStorage.getItem('identity')});
        setModalAgregarCuota(!ModalAgregarCuota);
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
                {data.PagoSaldo > 0 ?
                <>
                    <MenuItem>
                        <Typography onClick={()=>{handleChangeModalAgregarCuota(data)}} style={{textDecoration: 'none', color: "teal", cursor: "pointer"}}><i className='bx bxs-credit-card bx-xs'></i> Agregar Pago de Cuota</Typography>
                    </MenuItem>
                    <MenuItem>
                        <Typography onClick={()=>handleChangeModalRecargoPago(data)} style={{textDecoration: 'none', color: "darkorange", cursor: "pointer"}}><i className='bx bxs-error-alt bx-xs'></i> Añadir recargo</Typography>
                    </MenuItem>
                    <MenuItem>
                        <Typography onClick={()=>eliminarRecargo(data)} style={{textDecoration: 'none', color: "red", cursor: "pointer"}}><i className='bx bxs-trash bx-xs'></i> Eliminar recargo</Typography>
                    </MenuItem>
                </>
                :""}
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
            "selector": row => convertirAFecha(row["createdAt"]),
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
            "name": "Motivo de pago",
            "selector": row => row["DetallePagoMotivo"],
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
                            label="Año"
                            onChange={nuevoAño => {
                                setPagoAño(nuevoAño);
                                setPagoPeriodo(nuevoAño);
                                traerPagosPorAbonado(location.state.UserId, nuevoAño.getFullYear(), ConceptoId);
                            }}
                            value={PagoAño}
                        ></DatePicker>
                    </Grid>
                </Grid>
                <br/>
                <Tabs>
                    <TabList>
                        <Tab onClick={() => {
                            setConceptoId(2);
                            traerPagosPorAbonado(location.state.UserId, PagoAño.getFullYear(), 2)
                        }}><i className="bx bxs-notepad"></i> Inscripciones y reinscripciones</Tab>
                        <Tab onClick={() => {
                            setConceptoId(1);
                            traerPagosPorAbonado(location.state.UserId, PagoAño.getFullYear(), 1);
                        }}><i className='bx bxs-calendar'></i> Mensualidades</Tab>
                        <Tab onClick={() => {
                            setConceptoId(5);
                            traerPagosPorAbonado(location.state.UserId, PagoAño.getFullYear(), 5);
                        }}><i className='bx bxs-home'></i> Cambios de domicilio</Tab>
                        <Tab onClick={() => {
                            setConceptoId(6);
                            traerPagosPorAbonado(location.state.UserId, PagoAño.getFullYear(), 6);
                        }}><i className='bx bxs-plug'></i> Cambios de servicio</Tab>
                    </TabList>
                <TabPanel>
                <Datatable
                    loader={true}
                    columnas={columnasPagos}
                    datos={pagos}
                    paginacion={true}
                    buscar={true}
                />
                </TabPanel>
                <TabPanel>
                {location.pathname.split('/')[2] !== 'view' ?
                    <CardHeader
                        action={<><Button variant="outlined" startIcon={<i className="bx bx-calendar"></i>} color="primary" onClick={handleChangeModalNuevoPago}> Pago adelantado</Button><Button style={{marginLeft: 15}} variant="contained" startIcon={<i className="bx bx-calendar-week"></i>} color="primary" onClick={handleChangeModalNuevoPago}> Asentar pago mensual</Button></>}>
                    </CardHeader>
                :""}
                <Datatable
                    loader={true}
                    columnas={columnasPagos}
                    datos={pagos}
                    paginacion={true}
                    buscar={true}
                />
                </TabPanel>
                <TabPanel>
                <Datatable
                    loader={true}
                    columnas={columnasPagos}
                    datos={pagos}
                    paginacion={true}
                    buscar={true}
                />
                </TabPanel>
                <TabPanel>
                <Datatable
                    loader={true}
                    columnas={columnasPagos}
                    datos={pagos}
                    paginacion={true}
                    buscar={true}
                />
                </TabPanel>
                </Tabs>
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
                <Typography variant="h2"><i className="bx bx-dollar"></i> Datos del pago</Typography>
                <br/>
                <br/>
                <Grid container spacing={3}>
                    <Grid item xs={6} md={6} sm={6} lg={6}>
                        <TextField
                            variant="outlined"
                            label="Concepto"
                            value={ConceptoId}
                            name="ConceptoId"
                            fullWidth
                            select
                            onChange={handleChangeConceptoId}
                            >
                            {conceptos.map((concepto)=>(
                                <MenuItem key={concepto.MovimientoConceptoId} value={concepto.MovimientoConceptoId}>{concepto.MovimientoConceptoNombre}</MenuItem>
                            ))}
                        </TextField>
                    </Grid> 
                    <Grid item xs={12} md={6} sm={6} lg={6}>
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
                abrirModal={ModalAgregarCuota}
                funcionCerrar={handleChangeModalAgregarCuota}
                botones={
                <>
                <Button variant="contained" color="primary" onClick={() => agregarCuota(PagoInfo, detallesPago[0], MunicipioId, setModalAgregarCuota)}>Confirmar</Button>
                <Button onClick={handleChangeModalAgregarCuota}>Cerrar</Button></>}
                formulario={
                <>
                <Alert severity='info'>
                    <Typography variant="h6">Revise la información del pago a realizar.</Typography>
                </Alert>
                <br/>
                {detallesPago.length > 0 ?
                <Card>
                    <CardContent>
                        <Typography variant="h6"><i className="bx bx-money bx-xs"></i> Valor de la cuota: ${detallesPago[0].DetallePagoMonto}</Typography>
                        <Typography variant="h6"><i className="bx bx-credit-card bx-xs"></i> Medio de Pago: {detallesPago[0].MedioPagoNombre}</Typography>
                        <Typography variant="h6"><i className="bx bx-calendar bx-xs"></i> Fecha y hora de registro: {new Date().toLocaleDateString()} - { new Date().toLocaleTimeString()}</Typography>
                        <Typography variant="h6"><i className="bx bx-user bx-xs"></i> Usuario de registro: {sessionStorage.getItem('usr')}</Typography>
                    </CardContent>
                </Card>
                : ""}
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
                            <Typography>Agregar recargo sólamente si el abonado viene a pagar después del <b>20/{new Date().getMonth()+1}/{new Date().getFullYear()} </b>
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