import React from 'react'
import { Button, Card, CardActionArea, CardContent, Grid, InputAdornment, TextField, Typography } from '@material-ui/core';
import logo from './../../images/logo.png';
import useStyles from './../Styles';
import { Link } from 'react-router-dom';
const Login = () => {
    const styles = useStyles();
    return (
    <>
    <div className="fondo">
        <Card className={styles.cartaLogin}>
            <img className={styles.logoLogin} src={logo}/>
            <CardContent>
            <Typography variant="h2">Ingrese sus datos para continuar</Typography>
                <Grid container spacing = {3}>
                    <Grid item xs={12} lg={12} sm={12} md={12}>
                    <TextField
                    autoFocus
                    fullWidth
                    label="Usuario"
                    InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <i className="bx bx-user"></i>
                          </InputAdornment>
                        ),
                    }}
                    type="text"
                    variant="outlined">
                    </TextField>
                    </Grid>
                    <Grid item xs={12} lg={12} sm={12} md={12}>
                    <TextField
                    fullWidth
                    label="Contraseña"
                    InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <i className="bx bx-lock"></i>
                          </InputAdornment>
                        ),
                    }}
                    type="password"
                    variant="outlined">
                    </TextField>
                    </Grid>
                </Grid>
            <Link style={{textDecoration: 'none'}} to="/home">
                <Button fullWidth className={styles.botonIniciarSesion} variant="contained" color="primary">Iniciar sesión</Button>
            </Link>
            </CardContent>
        </Card>
    </div>
    </>
    );
}
 
export default Login;