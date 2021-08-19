import React from 'react';
import Aside from '../design/layout/Aside';
import { Button, Card, CardContent, Grid, NativeSelect, TextField, Typography } from '@material-ui/core'; 
import useStyles from './../Styles';
import { DatePicker } from '@material-ui/pickers';
import { useLocation } from 'react-router-dom';

const CaratulaAbonado = () => {
    const location = useLocation();
    const styles = useStyles();
    return ( 
    <>
    <Aside/>
    <Card className={styles.cartaPrincipal}>
        <CardContent>
            <Typography variant="h1">{location.state ? `Editar abonado: ${location.state.nombreCompleto}` : "Agregar abonado"}</Typography>
            <Typography variant="h2"><i className="bx bx-user"></i> Datos del abonado</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={3} lg={3}>
                    <TextField
                    autoFocus
                    variant="standard"
                    value={location.state ? location.state.nombreCompleto : ""}
                    fullWidth
                    label="Nombre Completo">
                    </TextField>
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                    <TextField
                    value={location.state ? location.state.dni : ""}
                    type="number"
                    fullWidth
                    label="DNI">
                    </TextField>
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                    <DatePicker
                    disableFuture
                    format="dd/MM/yyyy"
                    fullWidth
                    label="Fecha de nacimiento"
                    openTo="year"
                    views={["year", "month", "date"]}>
                    </DatePicker>
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                    <TextField
                    value={location.state ? location.state.email : ""}
                    type="email"
                    fullWidth
                    label="Correo electrónico">
                    </TextField>
                </Grid>
            </Grid>
            <Typography variant="h2"><i className="bx bx-home"></i> Datos del domicilio de instalación</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={6}>
                    <TextField
                    value={location.state ? location.state.domicilio.calle : ""}
                    fullWidth
                    label="Calle">
                    </TextField>
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                    <TextField
                    value={location.state ? location.state.domicilio.numero : ""}
                    type="number"
                    fullWidth
                    label="Número">
                    </TextField>
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                    <TextField
                    value={location.state ? location.state.domicilio.piso : ""}
                    type="number"
                    fullWidth
                    label="Piso">
                    </TextField>
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                    <TextField
                    value={location.state ? location.state.domicilio.provincia : ""}
                    fullWidth
                    label="Provincia">
                    </TextField>
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                    <TextField
                    value={location.state ? location.state.domicilio.municipio : ""}
                    fullWidth
                    label="Municipio">
                    </TextField>
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                    <TextField
                    value={location.state ? location.state.domicilio.barrio : ""}
                    fullWidth
                    label="Barrio">
                    </TextField>
                </Grid>
            </Grid>
            <Typography variant="h2"><i className="bx bx-plug"></i> Datos del servicio a contratar</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={3} lg={3}>
                    <NativeSelect
                    value={location.state ? location.state.servicio : ""}
                    fullWidth
                    >
                        <option>Cable</option>
                        <option>Internet</option>
                        <option>Cable + Internet </option>
                    </NativeSelect>
                </Grid>
            </Grid>
        </CardContent>
        <div style={{textAlign: 'center', marginBottom: '1.5rem'}}>
            <Button startIcon={<i className={location.state ? "bx bx-edit":"bx bx-check"}></i>}
            variant="contained" color="primary">
            {location.state ? "Modificar" : "Registrar"}
        </Button></div>
    </Card>
    </>
    );
}
 
export default CaratulaAbonado;