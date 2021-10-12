import React, { useState } from 'react';
import { Card, Button, Grid, CardContent, CardHeader, TextField, Typography, MenuItem } from '@material-ui/core';
import Datatable from '../design/components/Datatable';
import {detallesPagos} from './DatosTabla';
import {columnasDetallesPagos} from './ColumnasTabla';
import useStyles from '../Styles';
import Aside from '../design/layout/Aside';
import { useLocation } from 'react-router';
import Modal from './../design/components/Modal';
import { Alert } from '@material-ui/lab';

const ListaDetallesPagos = () => {
    const styles = useStyles();
    const location = useLocation();
    const [modalIngresarPago, setModalIngresarPago] = useState(false);
    const handleChangeModalIngresarPago = () => {
        setModalIngresarPago(!modalIngresarPago);
    }
    return (
        <>
            <Aside/>
            <Card className={styles.cartaPrincipal}>
                <CardContent>
                    <CardHeader
                    action={<Button onClick={handleChangeModalIngresarPago} variant="contained" color="primary">+ Nuevo Pago</Button>}>
                    </CardHeader>
                    <Typography variant="h1">Detalles de pago</Typography>
                    <Typography variant="h2">Período: {location.state.mes} de {location.state.año}</Typography>
                    <Datatable
                        columnas={columnasDetallesPagos}
                        datos={detallesPagos}
                        paginacion={true}
                        buscar={true}/>
                </CardContent>
            </Card>
            <Modal
                abrirModal={modalIngresarPago}
                funcionCerrar={handleChangeModalIngresarPago}
                titulo={<Alert severity="success" icon={<i className="bx bxs-user-x bx-sm"></i>}><b>Nuevo pago</b> fecha: {new Date().toLocaleDateString()}</Alert>}
                botones={
                <>
                <Button onClick={()=>
                    {//ingresarPago(infoBaja)
                    setModalIngresarPago(false)}}
                    variant="contained"
                    color="primary">
                    Aceptar</Button>
                <Button onClick={handleChangeModalIngresarPago}>Cerrar</Button></>}
                formulario={
                <>
                <Grid container spacing={3}>
                    <Grid item xs={12} lg={12} md={12} sm={12}>
                        <TextField
                        autoFocus
                        fullWidth
                        variant="outlined"
                        type="number"
                        placeholder="Monto recibido"
                        ></TextField>
                    </Grid>
                    <Grid item xs={12} lg={12} md={12} sm={12}>
                        <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Forma de Pago"
                        select
                        >
                        <MenuItem>Efectivo</MenuItem>
                        <MenuItem>Débito</MenuItem>
                        <MenuItem>Crédito</MenuItem>
                        <MenuItem>CBU - Transferencia</MenuItem>
                        </TextField>
                    </Grid>
                </Grid>
                </>}
                >
                </Modal>
        </>
    );
}
 
export default ListaDetallesPagos;