import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../../../context/appContext';
import Aside from '../design/layout/Aside';
import Footer from '../design/layout/Footer';
import { Button, Card, CardContent, Grid, TextField, Typography} from '@material-ui/core'; 
import { useLocation } from 'react-router-dom';

const PerfilUser = () => {
    const appContext = useContext(AppContext);
    const { modificarUsuario } = appContext;
    const location = useLocation();

    const [UserInfo, setUserInfo] = useState({
        UserIdLogueado: localStorage.getItem('identity'),
        UserId: null,
        Nombre: null,
        Apellido: null,
        Documento: null,
        Email: null,
        Telefono: null,
        NombreUsuario: null,
        Contraseña: null,
        RContraseña: null
    });

    const onInputChange = (e) => {
        setUserInfo({
            ...UserInfo,
            [e.target.name] : e.target.value
        });
    }
    const { UserId, Nombre, Apellido, Documento, Email, Telefono, NombreUsuario, Contraseña, RContraseña} = UserInfo;
    
    useEffect(()=> {
        if(location.state){
            setUserInfo({
                UserId: location.state.User.UserId,
                Nombre: location.state.User.Nombre,
                Apellido: location.state.User.Apellido,
                Documento: location.state.User.Documento,
                Email: location.state.User.Email,
                Telefono: location.state.User.Telefono,
                NombreUsuario: location.state.User.NombreUsuario,
                Contraseña: "",
                RContraseña: ""
            });
        }
    },[]);
   
    const onSubmitUsuario = (e) => {
        e.preventDefault();
        if(location.state) {
            modificarUsuario({
                UserId,
                Nombre,
                Apellido,
                Documento,
                Email,
                Telefono,
                NombreUsuario,
                Contraseña,
                RContraseña,
            }, true);
        }
    }
    return ( 
    <>
    <div className="container">
    <Aside/>
    <main>
    <Typography variant="h6">Editar usuario: {localStorage.getItem('usr')}</Typography>
    <br/>
    <form onSubmit={onSubmitUsuario}>
        <Card>
        <CardContent>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={6} xl={6}>
                    <TextField
                    autoFocus
                    variant="outlined"
                    value={Nombre}
                    name="Nombre"
                    onChange={onInputChange}
                    fullWidth
                    label="Nombre">
                    </TextField>
                </Grid>
                <Grid item xs={12} md={6} lg={6} xl={6}>
                    <TextField
                    variant="outlined"
                    value={Apellido}
                    name="Apellido"
                    onChange={onInputChange}
                    fullWidth
                    label="Apellido">
                    </TextField>
                </Grid>
                <Grid item xs={12} md={4} lg={4} xl={4}>
                    <TextField
                    variant="outlined"
                    value={Documento}
                    name="Documento"
                    onChange={onInputChange}
                    fullWidth
                    label="DNI"
                    onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                    }}}>
                    </TextField>
                </Grid>
                <Grid item xs={12} md={4} lg={4} xl={4}>
                    <TextField
                    variant="outlined"
                    value={Email}
                    name="Email"
                    onChange={onInputChange}
                    fullWidth
                    label="Email"
                    >
                    </TextField>
                </Grid>
                <Grid item xs={12} md={4} lg={4} xl={4}>
                    <TextField
                    variant="outlined"
                    value={Telefono}
                    name="Telefono"
                    onChange={onInputChange}
                    onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                    }}}
                    fullWidth
                    label="N° Teléfono">
                    </TextField>
                </Grid>
                <Grid item xs={12} md={4} lg={4} xl={4}>
                    <TextField
                    disabled= {location.state ? true : false}
                    variant={location.state ? "filled": "outlined"}
                    value={NombreUsuario}
                    name="NombreUsuario"
                    onChange={onInputChange}
                    fullWidth
                    label="Nombre de usuario">
                    </TextField>
                </Grid>
                <Grid item xs={12} md={4} lg={4} xl={4}>
                    <TextField
                    variant="outlined"
                    value={Contraseña}
                    name="Contraseña"
                    onChange={onInputChange}
                    type="password"
                    fullWidth
                    label="Contraseña"
                    >
                    </TextField>
                </Grid>
                <Grid item xs={12} md={4} lg={4} xl={4}>
                    <TextField
                    variant="outlined"
                    value={RContraseña}
                    name="RContraseña"
                    onChange={onInputChange}
                    type="password"
                    fullWidth
                    label="Repita contraseña">
                    </TextField>
                </Grid>
                </Grid>
        </CardContent>
        <div style={{textAlign: 'center', marginBottom: '1.5rem'}}>
            <Button type="submit" startIcon={<i className="bx bx-edit"></i>} variant="contained" color="primary">
            Modificar
        </Button>
        </div>
    </Card>    
    </form>
    </main>
    <br/>
    <Footer/>
    </div>
    </>
    );
}
 
export default PerfilUser;