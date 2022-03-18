import React, { useState, useContext, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, Chip, Grid,  MenuItem, TextField, Tooltip, Typography } from '@material-ui/core';
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
import Spinner from '../design/components/Spinner';

const ListaPagos = () => {
    const appContext = useContext(AppContext);
    const { pagos, pagosPendientes, pagosPendientesTop, detallesPago, mediosPago, conceptos, crearPago, agregarRecargo, eliminarRecargo, eliminarDetallePago, traerPagosPorAbonado, traerDetallesPago, traerMediosPago, traerConceptos, traerPagosMensualesPendientes, cargando, mostrarSpinner } = appContext;

    const location = useLocation();
    const [PagoAño, setPagoAño] = useState(new Date());
    const [ConceptoId, setConceptoId] = useState(null);
    const [MunicipioId, setMunicipioId] = useState(null);
    const [MedioPagoId, setMedioPagoId] = useState(null);
    const [CantidadMesesAPagar, setCantidadMesesAPagar] = useState(null);

    const [PagoInfo, setPagoInfo] = useState({
        PagoId: null,
        PagoMes: null,
        PagoAño: null,
        UserId: location.state.UserId,
        PagoRecargo: null,
        PagoTotal: location.state.ServicioPrecioUnitario,
        DetallePagoId: '',
        DetallePagoFecha: new Date(),
        DetallePagoMonto: '',
        DetallePagoObservaciones: '',
        createdBy: sessionStorage.getItem('identity'),
        updatedAt: null,
        updatedBy: sessionStorage.getItem('identity'),
        deletedBy: null,
        deletedAt: null
    });

    const { DetallePagoMonto, DetallePagoObservaciones } = PagoInfo;

    const [ModalPagoAdelantado, setModalPagoAdelantado] = useState(false);
    const [ModalNuevoPago, setModalNuevoPago] = useState(false);
    const [ModalRecargo, setModalRecargo] = useState(false);
    const [ModalDetallesPago, setModalDetallesPago] = useState(false);
    const [ModalEliminarDetallePago, setModalEliminarDetallePago] = useState(false);
    
    useEffect(()=>{
        setMunicipioId(location.state.MunicipioId);
        traerConceptos(1);
        traerMediosPago();
        traerPagosPorAbonado(location.state.UserId, PagoAño.getFullYear(), 2);  //trae por defecto el 1er tab
    },[]);

    const onInputChange = (e) => {
        setPagoInfo({
            ...PagoInfo,
            [e.target.name] : e.target.value
        });
    }
    const handleChangeMedioPagoId = (e) => {
        setMedioPagoId(e.target.value);
    }
    const handleChangeMesesAPagar = (e) => {
        mostrarSpinner();
        setCantidadMesesAPagar(e.target.value);
        traerPagosMensualesPendientes(location.state.UserId, 1, e.target.value);
    }
    const handleChangeModalPagoAdelantado = (data, edit = false) => {
        setModalPagoAdelantado(!ModalPagoAdelantado);
        traerPagosMensualesPendientes(location.state.UserId, 1);
    }
    const handleChangeModalNuevoPago = (data, edit = false) => {
        setModalNuevoPago(!ModalNuevoPago);
        setPagoInfo({
            ...data,
            Año: data.PagoAño,
            Mes: data.PagoMes,
            DetallePagoMonto: data.PagoSaldo,
        });
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
            "selector": row => row["PagoSaldo"] === 0 ? <i style={{color: 'green'}} className="bx bx-check bx-md"></i> :<div style={{display: 'inline-block'}}><i style={{color: 'red'}} className="bx bx-x bx-md"></i><span><b>Debe:</b> ${row["PagoSaldo"]}</span></div>,
            "wrap": true
        },
        {
            "name": "Observaciones",
            "selector": row => row["PagoObservaciones"] ? row["PagoObservaciones"] : '-',
            "sortable": true,
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
                        <Typography onClick={()=>{handleChangeModalNuevoPago(data)}} style={{textDecoration: 'none', color: "teal", cursor: "pointer"}}><i className='bx bxs-credit-card bx-xs'></i> Agregar Pago</Typography>
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
    const columnasPagosPendientes = [
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
    const mesesAPagar = [{key: 6,value: 6},{key: 12,value: 12},{key: 18,value: 18},{key: 24,value: 24}];
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
                    paginacionPorDefecto={15}
                />
                </TabPanel>
                <TabPanel>
                {location.pathname.split('/')[2] !== 'view' ?
                    <CardHeader
                        action={<Button variant="contained" startIcon={<i className="bx bx-calendar"></i>} color="secondary" onClick={handleChangeModalPagoAdelantado}> Pago adelantado</Button>}>
                    </CardHeader>
                :""}
                <Datatable
                    loader={true}
                    columnas={columnasPagos}
                    datos={pagos}
                    paginacion={true}
                    buscar={true}
                    paginacionPorDefecto={15}
                />
                </TabPanel>
                <TabPanel>
                <Datatable
                    loader={true}
                    columnas={columnasPagos}
                    datos={pagos}
                    paginacion={true}
                    buscar={true}
                    paginacionPorDefecto={15}
                />
                </TabPanel>
                <TabPanel>
                <Datatable
                    loader={true}
                    columnas={columnasPagos}
                    datos={pagos}
                    paginacion={true}
                    buscar={true}
                    paginacionPorDefecto={15}
                />
                </TabPanel>
                </Tabs>
                <Modal
                abrirModal={ModalPagoAdelantado}
                funcionCerrar={handleChangeModalPagoAdelantado}
                botones={
                <>
                <Button onClick={()=>
                    {
                    crearPago(
                        {PagoInfo,
                        MedioPagoId,
                        MunicipioId
                    }, handleChangeModalPagoAdelantado)}}
                    variant="contained"
                    color="primary">
                    Aceptar</Button>
                <Button onClick={handleChangeModalPagoAdelantado}>Cerrar</Button></>}
                formulario={
                <>
                <Card>
                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                <Card>
                                    <CardContent>
                                    <Typography variant="h2">Meses que debe({pagosPendientes.length})</Typography>
                                    <Datatable
                                            loader={true}
                                            columnas={columnasPagosPendientes}
                                            datos={pagosPendientes}
                                            paginacion
                                    />
                                    </CardContent>
                                </Card>
                                <br/>
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                <Card>
                                    <CardContent>
                                    <Typography variant="h2"> Seleccione los meses a pagar y el medio de pago</Typography>   
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={6} md={6} lg={6}>
                                                <TextField
                                                    variant="outlined"
                                                    label="Cantidad de meses a pagar"
                                                    value={CantidadMesesAPagar}
                                                    name="CantidadMesesAPagar"
                                                    fullWidth
                                                    select
                                                    onChange={handleChangeMesesAPagar}
                                                    >
                                                    {mesesAPagar
                                                    .filter((mp)=>(
                                                        mp.value <= pagosPendientes.length //filtramos los meses según los pagos pendientes que tenga
                                                    ))
                                                    .map((mp)=>(
                                                        <MenuItem key={mp.key} value={mp.value}>{mp.value}</MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={6} lg={6}>
                                                <TextField
                                                    variant="outlined"
                                                    label="Medio de Pago"
                                                    value={MedioPagoId}
                                                    name="MedioPagoId"
                                                    fullWidth
                                                    select
                                                    onChange={handleChangeMedioPagoId}>
                                                    {mediosPago
                                                    .filter((mp)=> mp.MedioPagoId !== 10)
                                                    .map((mp)=>(
                                                        <MenuItem key={mp.MedioPagoId} value={mp.MedioPagoId}>{mp.MedioPagoNombre}</MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                                <br/>
                                {pagosPendientesTop.length > 0 && !cargando ?
                                <Card>
                                    <CardContent>
                                        <Typography variant="h2">Datos del pago</Typography>
                                        <Typography variant="h6">Meses a pagar: {pagosPendientesTop.map((pagosPend)=>(<Chip icon={<i className="bx bx-calendar"></i>} color="secondary" style={{margin: 2, fontSize: 10}} label={pagosPend.PagoMes+"/"+pagosPend.PagoAño}></Chip>))}</Typography>
                                        {CantidadMesesAPagar === 6 ?
                                        <><Typography variant="h6">Subtotal : ${pagosPendientesTop.map(item => item.PagoTotal).reduce((prev, curr) => prev + curr, 0)}</Typography>
                                        <Typography variant="h6">Descuento del {location.state.ServicioBonificacionPagoSeisMeses}% : ${(pagosPendientesTop.map(item => item.PagoTotal).reduce((prev, curr) => (prev + curr), 0))*location.state.ServicioBonificacionPagoSeisMeses/100}</Typography>
                                        <Typography variant="h6">Total con descuento aplicado : ${pagosPendientesTop.map(item => item.PagoTotal).reduce((prev, curr) => (prev + curr), 0)-(pagosPendientesTop.map(item => item.PagoTotal).reduce((prev, curr) => (prev + curr), 0))*location.state.ServicioBonificacionPagoSeisMeses/100}</Typography></>
                                        :CantidadMesesAPagar === 12  ?
                                        <><Typography variant="h6">Total : ${pagosPendientesTop.map(item => item.PagoTotal).reduce((prev, curr) => prev + curr, 0)-pagosPendientesTop[pagosPendientesTop.length-1].PagoTotal}</Typography>
                                        <Typography variant="h6">Mes gratis : <Chip icon={<i className="bx bx-calendar"></i>} variant="outlined" color="primary" style={{margin: 2, fontSize: 10}} label={pagosPendientesTop[pagosPendientesTop.length-1].PagoMes+"/"+pagosPendientesTop[pagosPendientesTop.length-1].PagoAño}></Chip></Typography></>
                                        :CantidadMesesAPagar === 18 ?
                                        <><Typography variant="h6">Total : ${pagosPendientesTop.map(item => item.PagoTotal).reduce((prev, curr) => prev + curr, 0)-pagosPendientesTop[pagosPendientesTop.length-1].PagoTotal-pagosPendientesTop[pagosPendientesTop.length-2].PagoTotal}</Typography>
                                        <Typography variant="h6">Meses gratis : <Chip icon={<i className="bx bx-calendar"></i>} variant="outlined" color="primary" style={{margin: 2, fontSize: 10}} label={pagosPendientesTop[pagosPendientesTop.length-2].PagoMes+"/"+pagosPendientesTop[pagosPendientesTop.length-2].PagoAño}></Chip><Chip icon={<i className="bx bx-calendar"></i>} variant="outlined" color="primary" style={{margin: 2, fontSize: 10}} label={pagosPendientesTop[pagosPendientesTop.length-1].PagoMes+"/"+pagosPendientesTop[pagosPendientesTop.length-1].PagoAño}></Chip></Typography></>
                                        :CantidadMesesAPagar === 24?
                                        <><Typography variant="h6">Total : ${pagosPendientesTop.map(item => item.PagoTotal).reduce((prev, curr) => prev + curr, 0)-pagosPendientesTop[pagosPendientesTop.length-1].PagoTotal-pagosPendientesTop[pagosPendientesTop.length-2].PagoTotal-pagosPendientesTop[pagosPendientesTop.length-3].PagoTotal}</Typography>
                                        <Typography variant="h6">Meses gratis : <Chip icon={<i className="bx bx-calendar"></i>} variant="outlined" color="primary" style={{margin: 2, fontSize: 10}} label={pagosPendientesTop[pagosPendientesTop.length-3].PagoMes+"/"+pagosPendientesTop[pagosPendientesTop.length-3].PagoAño}></Chip><Chip icon={<i className="bx bx-calendar"></i>} variant="outlined" color="primary" style={{margin: 2, fontSize: 10}} label={pagosPendientesTop[pagosPendientesTop.length-2].PagoMes+"/"+pagosPendientesTop[pagosPendientesTop.length-2].PagoAño}></Chip><Chip icon={<i className="bx bx-calendar"></i>} variant="outlined" color="primary" style={{margin: 2, fontSize: 10}} label={pagosPendientesTop[pagosPendientesTop.length-1].PagoMes+"/"+pagosPendientesTop[pagosPendientesTop.length-1].PagoAño}></Chip></Typography></> :""}
                                    </CardContent>
                                </Card>
                                : !cargando ? "" : <Spinner></Spinner>}
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                </>}
                >
                </Modal>
                <Modal
                abrirModal={ModalNuevoPago}
                funcionCerrar={handleChangeModalNuevoPago}
                botones={
                <>
                <Button onClick={()=>
                    {
                    crearPago(
                        {PagoInfo,
                        MedioPagoId,
                        MunicipioId
                    }, handleChangeModalNuevoPago)}}
                    variant="contained"
                    color="primary">
                    Aceptar</Button>
                <Button onClick={handleChangeModalNuevoPago}>Cerrar</Button></>}
                formulario={
                <>
                <Typography variant="h2"><i className="bx bx-dollar"></i> Datos del pago</Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6} sm={6} lg={6}>
                        <TextField
                            variant="filled"
                            label="Concepto"
                            value={ConceptoId}
                            name="ConceptoId"
                            fullWidth
                            select
                            disabled
                            >
                            {conceptos.map((concepto)=>(
                                <MenuItem key={concepto.MovimientoConceptoId} value={concepto.MovimientoConceptoId}>{concepto.MovimientoConceptoNombre}</MenuItem>
                            ))}
                        </TextField>
                    </Grid> 
                    <Grid item xs={12} md={6} sm={6} lg={6}>
                        <TextField
                        variant="filled"
                        value={PagoInfo.PagoMes + "/" + PagoInfo.PagoAño}
                        fullWidth
                        label="Período de Pago"
                        disabled
                        >
                        </TextField>
                    </Grid>
                    <Grid item xs={6} md={6} sm={6} lg={6}>
                        <TextField
                            variant="filled"
                            label="Total ($)"
                            value={DetallePagoMonto}
                            name="DetallePagoMonto"
                            fullWidth
                            disabled
                            >
                        </TextField>
                    </Grid>
                    <Grid item xs={6} md={6} sm={6} lg={6}>
                        <TextField
                            variant="outlined"
                            label="Medio de Pago"
                            value={MedioPagoId}
                            name="MedioPagoId"
                            fullWidth
                            select
                            onChange={handleChangeMedioPagoId}
                            >
                            {mediosPago
                            .filter((mp)=> mp.MedioPagoId !== 10)
                            .map((mp)=>(
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