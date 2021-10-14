import React, { useState, useContext, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, Grid, MenuItem, TextField, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import Datatable from '../design/components/Datatable';
import {pagoos, detallespagoos} from './DatosTabla';
import {columnasPagos, columnasDetallesPagos} from './ColumnasTabla';
import Aside from '../design/layout/Aside';
import { useLocation } from 'react-router';
import Footer from '../design/layout/Footer';
import Modal from '../design/components/Modal';
import { DatePicker } from '@material-ui/pickers';
import AppContext from '../../../context/appContext';

const ListaPagos = () => {
    const appContext = useContext(AppContext);
    const { pagos, detallesPagos, mediosPago, crearPago, traerMediosPago } = appContext;

    const location = useLocation();
    const [PagoInfo, setPagoInfo] = useState({
        UserId: null,
        DetallePagoFecha: new Date(),
        DetallePagoMonto: '',
        DetallePagoObservaciones: '',
        MedioPagoId: 1,
        PagoTotal: location.state.ServicioPrecioUnitario
    });
    const [PagoPeriodo, setPagoPeriodo] = useState(new Date());
    const { DetallePagoMonto, DetallePagoObservaciones} = PagoInfo;

    const [modalNuevoPago, setModalNuevoPago] = useState(false);
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
    const handleChangeNuevoPago = (data) => {
        setModalNuevoPago(!modalNuevoPago)
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
    let saldo = 0;
    const saldos = pagos.map((item)=>(
        item.saldo !== 0  ? saldo = saldo + item.total : ""
    ))
    useEffect(()=>{
        traerMediosPago();
    },[])
    const ExpandedComponent = ({ data }) =>
    <>
    <br/>
    <Typography style={{marginTop: 0}} variant="h2">Saldo del Mes: $1500</Typography>
        <div style={{marginBottom: '1rem', marginLeft: '1rem'}}>
            <Datatable
            datos={detallespagoos}
            columnas={columnasDetallesPagos}
            paginacion={false}
            buscar={false}/>
        </div>
    </>;
    return (
        <>
        <div className="container">
        <Aside/>
        <main>
        <Card>
        <CardHeader
            action={<Button variant="contained" color="primary" onClick={handleChangeNuevoPago}>+ Asentar pago</Button>}>
        </CardHeader>
            <CardContent>
                <Typography variant="h1">Historial de pagos de: {location.state.Apellido}, {location.state.Nombre}</Typography>
                <Typography variant="h2">Saldo total acumulado: $ {1800}
                </Typography>
                <Datatable
                    expandedComponent={ExpandedComponent}
                    columnas={columnasPagos}
                    datos={pagoos}
                    paginacion={true}
                    buscar={true}
                />
                <Modal
                abrirModal={modalNuevoPago}
                funcionCerrar={handleChangeNuevoPago}
                //titulo={<Alert severity="error" icon={<i className="bx bxs-user-x bx-sm"></i>}>Si usted da de baja al abonado, pasará al listado de <b>Abonados Inactivos</b></Alert>}
                botones={
                <>
                <Button onClick={()=>
                    {crearPago(PagoInfo)}}
                    variant="contained"
                    color="primary">
                    Aceptar</Button>
                <Button onClick={handleChangeNuevoPago}>Cerrar</Button></>}
                formulario={
                <>
                <Typography style={{marginTop: '0px'}} variant="h2"><i className="bx bx-dollar"></i> Datos del pago</Typography>
                <Alert severity="success"><b>Total por servicio contratado({location.state.ServicioNombre}):</b> ${location.state.ServicioPrecioUnitario}</Alert>
                <br/>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={12} sm={12} lg={12}>
                        <DatePicker
                        inputVariant="outlined"
                        value={PagoPeriodo}
                        onChange={(periodo)=>setPagoPeriodo(periodo)}
                        fullWidth
                        views={["year", "month"]}
                        label="Período de Pago"
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
                {location.state.ServicioPrecioUnitario >= DetallePagoMonto ? <Alert severity="info"><b>
                    Saldo restante del mes: ${location.state.ServicioPrecioUnitario - DetallePagoMonto}
                </b></Alert> : <Alert severity="error"><b>Monto Incorrecto!</b></Alert>}
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