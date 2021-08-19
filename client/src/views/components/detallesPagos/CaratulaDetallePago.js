import React from 'react'
import { Button, Card, CardContent, Grid, NativeSelect, TextField, Typography } from '@material-ui/core'; 
import useStyles from './../Styles';
import { useLocation } from 'react-router-dom';
import Aside from '../design/layout/Aside';

const CaratulaDetallePago = () => {
    const location = useLocation();
    const styles = useStyles();
    return(
        <>
        <Aside/>
        <Card className={styles.cartaPrincipal}>
            <CardContent>
            <Typography variant="h1">{location.state ? `Editar pago: ${location.state.id}` : "Agregar pago"}</Typography>
            <Typography variant="h2"><i className="bx bx-user"></i> Datos del abonado</Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} lg={4} md={4}>
                        <TextField
                        autoFocus
                        fullWidth
                        variant="standard"
                        placeholder="Nombre Completo"
                        ></TextField>
                    </Grid>
                    <Grid item xs={12} lg={4} md={4}>
                        <TextField
                            autoFocus
                            fullWidth
                            variant="standard"
                            placeholder="DNI"
                        ></TextField>
                    </Grid>
                    <Grid item xs={12} lg={4} md={4}>
                        <TextField
                        fullWidth
                        variant="standard"
                        placeholder="Domicilio completo"
                        ></TextField>
                    </Grid>
                </Grid>
                <Typography variant="h2"><i className="bx bx-user"></i> Datos del pago</Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} lg={4} md={4}>
                        <TextField
                        autoFocus
                        fullWidth
                        variant="standard"
                        type="number"
                        placeholder="Monto a pagar"
                        ></TextField>
                    </Grid>
                    <Grid item xs={12} lg={4} md={4}>
                        <TextField
                        disabled
                        fullWidth
                        variant="standard"
                        placeholder="Fecha de pago"
                        defaultValue={new Date().toLocaleDateString()}
                        ></TextField>
                    </Grid>
                </Grid>
                <Typography variant="h2"><i className="bx bx-user"></i> Datos de la forma de pago</Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} lg={4} md={4}>
                        <NativeSelect
                        fullWidth
                        variant="standard"
                        placeholder="Forma de Pago"
                        >
                        <option>Efectivo</option>
                        <option>Débito</option>
                        <option>Crédito</option>
                        <option>CBU - Transferencia</option>
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
 
export default CaratulaDetallePago;
