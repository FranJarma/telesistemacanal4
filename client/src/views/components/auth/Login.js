import React, { useState, useContext, useEffect } from 'react'
import { Button, Card, CardContent, Grid, InputAdornment, TextField, Typography } from '@material-ui/core';
import logo from './../../images/logo.png';
import useStyles from './../Styles';
import AppContext from '../../../context/appContext';
import { useHistory } from 'react-router';
const Login = () => {
    const styles = useStyles();
    const history = useHistory();
    const appContext = useContext(AppContext);
    const { usuarioAutenticado, iniciarSesion } = appContext;
    const [AuthInfo, setAuthInfo] = useState({
      NombreUsuario: '',
      Contraseña: ''
    });
    const { NombreUsuario, Contraseña } = AuthInfo;
    const onChange = e => {
      setAuthInfo({
        ...AuthInfo,
        [e.target.name] : e.target.value
      });
    }
    const onSubmit = e => {
      e.preventDefault();
      iniciarSesion(AuthInfo);
    };
    // useEffect(()=>{
    //   if(usuarioAutenticado){
    //     history.push('/home');
    //   }
    // },[usuarioAutenticado, history]);
    return (
    <>
    <form onSubmit={onSubmit}>
    <div className="fondo">
        <Card className={styles.cartaLogin}>
            <img className={styles.logoLogin} src={logo} alt=""/>
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
                    variant="outlined"
                    value={NombreUsuario}
                    name="NombreUsuario"
                    onChange={onChange}>
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
                    variant="outlined"
                    value={Contraseña}
                    name="Contraseña"
                    onChange={onChange}>
                    </TextField>
                    </Grid>
                </Grid>
                <Button type="submit" fullWidth className={styles.botonIniciarSesion} variant="contained" color="primary">Iniciar sesión</Button>
            </CardContent>
        </Card>
    </div>
    </form>
    </>
    );
}
 
export default Login;