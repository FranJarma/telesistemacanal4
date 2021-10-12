import React, { useState } from 'react';
import { Button, Card, CardContent, CardHeader, Grid, MenuItem, Table, TableHead, TableCell, TableRow, TableContainer, TextField, TableBody, Paper, Typography, FormHelperText } from '@material-ui/core';
import Datatable from '../design/components/Datatable';
import {pagos, detallesPagos} from './DatosTabla';
import {columnasPagos, columnasDetallesPagos} from './ColumnasTabla';
import Aside from '../design/layout/Aside';
import { useLocation } from 'react-router';
import Footer from '../design/layout/Footer';
import Modal from '../design/components/Modal';
import { DatePicker } from '@material-ui/pickers';

const ListaPagos = () => {
    const location = useLocation();
    
    const [AbonadoInfo, setAbonadoInfo] = useState({
        UserId: null,
        EstadoId: null,
        MedioPago: 0,
        CambioEstadoObservaciones: null,
        pago: null
    });
    const { UserId, EstadoId, MedioPago, CambioEstadoObservaciones } = AbonadoInfo;
    const [PeriodoPago, setPeriodoPago] = useState(new Date());

    const [modalDarDeBaja, setModalDarDeBaja] = useState(false);

    const handleChangeModalDarDeBaja = (data) => {
        setModalDarDeBaja(!modalDarDeBaja)
        if(!modalDarDeBaja){
            setAbonadoInfo({
                EstadoId: 3,
                CambioEstadoFecha: new Date().toJSON(),
                UserId: data.UserId,
            })
        }
        else {
            setAbonadoInfo({
                UserId: null
            })
        }
    }
    let saldo = 0;
    const saldos = pagos.map((item)=>(
        item.saldo !== 0  ? saldo = saldo + item.total : ""
    ))
    const ExpandedComponent = ({ data }) =>
    <>
    <Typography style={{marginTop: 0}} variant="h2">Saldo: $1500</Typography>
        <div style={{marginBottom: '1rem'}}>
            <Datatable
            datos={detallesPagos}
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
            action={<Button variant="contained" color="primary" onClick={handleChangeModalDarDeBaja}>+ Asentar pago</Button>}>
        </CardHeader>
            <CardContent>
                <Typography variant="h1">Historial de pagos de: {location.state.Apellido}, {location.state.Nombre}</Typography>
                <Typography variant="h2">Saldo total acumulado al día de la fecha: $ {1800}
                </Typography>
                <Datatable
                    expandedComponent={ExpandedComponent}
                    columnas={columnasPagos}
                    datos={pagos}
                    paginacion={true}
                />
                <Modal
                abrirModal={modalDarDeBaja}
                funcionCerrar={handleChangeModalDarDeBaja}
                //titulo={<Alert severity="error" icon={<i className="bx bxs-user-x bx-sm"></i>}>Si usted da de baja al abonado, pasará al listado de <b>Abonados Inactivos</b></Alert>}
                botones={
                <>
                <Button onClick={()=>
                    {//cambiarEstadoAbonado(AbonadoInfo)
                    setModalDarDeBaja(false)}}
                    variant="contained"
                    color="primary">
                    Aceptar</Button>
                <Button onClick={handleChangeModalDarDeBaja}>Cerrar</Button></>}
                formulario={
                <>
                <Typography style={{marginTop: '0px'}} variant="h2"><i className="bx bx-dollar"></i> Datos del pago</Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={12} sm={12} lg={12}>
                        <DatePicker
                        inputVariant="outlined"
                        value={PeriodoPago}
                        onChange={(periodo)=>setPeriodoPago(periodo)}
                        format="MM/yyyy"
                        fullWidth
                        views={["year", "month"]}
                        label="Período de Pago"
                        >
                        </DatePicker>
                        <FormHelperText>Total: $1400</FormHelperText>
                    </Grid>
                    <Grid item xs={6} md={6} sm={6} lg={6}>
                        <TextField
                            variant="outlined"
                            label="Recibido"
                            type="number"
                            name="CambioEstadoObservaciones"
                            fullWidth
                            >
                        </TextField>
                    </Grid>
                    <Grid item xs={6} md={6} sm={6} lg={6}>
                        <TextField
                            variant="outlined"
                            label="Medio de Pago"
                            value={MedioPago}
                            name="MedioPago"
                            fullWidth
                            select
                            >
                            <MenuItem value={0}>Contado</MenuItem>
                            <MenuItem value={1}>Tarjeta de Débito</MenuItem>
                            <MenuItem value={2}>CBU</MenuItem>
                        </TextField>
                    </Grid>
                </Grid>
                <br/>
                <Typography>Saldo restante del mes:</Typography>
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