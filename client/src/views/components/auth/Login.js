import React, { useState, useContext, useEffect } from 'react'
import { Button, Card, CardContent, Grid, InputAdornment, TextField, Typography } from '@material-ui/core';
import logo from './../../../assets/images/logo-ts-transparente.png';
import olinet from './../../../assets/images/olinet.png';
import useStyles from './../Styles';
import AppContext from '../../../context/appContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const styles = useStyles();
    const navigate = useNavigate();
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
    useEffect(()=>{
      if(usuarioAutenticado){
        navigate('/home');
      }
    },[usuarioAutenticado, navigate]);
    return (
    <>
    <form onSubmit={onSubmit}>
    <div className="fondo">
        <Card className={styles.cartaLogin}>
          <div style={{display: 'flex'}}>
            <img className={styles.logoLogin} src={logo} alt="logo-tls"/>
            <img className={styles.logoLogin} src={olinet} alt="logo-olinet"/>
          </div>
            <CardContent>
            <Typography variant="h2">Ingrese sus datos para continuar</Typography>
                <Grid container spacing = {3}>
                    <Grid item xs={12} lg={12} sm={12} md={12}>
                    <TextField
                    color='secondary'
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
                    color='secondary'
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
                <Button color='secondary' type="submit" fullWidth className={styles.botonIniciarSesion} variant="contained">Iniciar sesión</Button>
            </CardContent>
        </Card>
    </div>
    </form>
    </>
    );
}
 
export default Login;