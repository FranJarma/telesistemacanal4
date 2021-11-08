import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../../../context/appContext';
import Aside from '../design/layout/Aside';
import Footer from '../design/layout/Footer';
import { Button, Card, CardContent, FormControlLabel, Grid, FormGroup, FormHelperText, MenuItem, Select, Switch, TextField, Typography } from '@material-ui/core'; 
import { useLocation } from 'react-router-dom';

const CaratulaUser = () => {
    const appContext = useContext(AppContext);
    const { roles, traerRoles, crearUsuario, modificarUsuario } = appContext;
    
    const location = useLocation();

    const [UserInfo, setUserInfo] = useState({
        UserId: null,
        Nombre: null,
        Apellido: null,
        Documento: null,
        Email: null,
        Telefono: null,
        NombreUsuario: null,
        Contraseña: null,
        RContraseña: null
    })
    const [EsUsuarioDePrueba, setEsUsuarioDePrueba] = useState(0);
    const handleChangeCheckUsuarioDePrueba = (e) => {
        setEsUsuarioDePrueba(e.target.checked);
    }
    const onInputChange = (e) => {
        setUserInfo({
            ...UserInfo,
            [e.target.name] : e.target.value
        });
    }
    const { UserId, Nombre, Apellido, Documento, Cuit, Email, Telefono, NombreUsuario, Contraseña, RContraseña} = UserInfo;

    const [RolesSeleccionados, setRolesSeleccionados] = useState([]);

    const handleChangeRolesSeleccionados = (e) => {
        const {
          target: { value },
        } = e;
        setRolesSeleccionados(
          typeof value === 'string' ? value.split(',') : value,
        );
    };

    useEffect(()=> {
        traerRoles();
    }, [])

    useEffect(() => {
        if(location.state)
        {
            setUserInfo({
                UserId: location.state.UserId,
                Nombre: location.state.Nombre,
                Apellido: location.state.Apellido,
                Documento: location.state.Documento,
                Cuit: location.state.Cuit,
                Email: location.state.Email,
                Telefono: location.state.Telefono,
                EsUsuarioDePrueba: location.state.EsUsuarioDePrueba
            });
        }
    }, [location.state])

    const onSubmitUsuario = (e) => {
        e.preventDefault();
        if(!location.state) {
            crearUsuario({
                Nombre,
                Apellido,
                Documento,
                Cuit,
                Email,
                Telefono,
                NombreUsuario,
                Contraseña,
                RContraseña,
                EsUsuarioDePrueba,
                RolesSeleccionados
            });
        }
        else {
            modificarUsuario({
                UserId,
                Nombre,
                Apellido,
                Documento,
                Cuit,
                Email,
                Telefono,
                NombreUsuario,
                Contraseña,
                RContraseña,
                EsUsuarioDePrueba,
                RolesSeleccionados
            });
        }
    }
    return ( 
    <>
    <div className="container">
    <Aside/>
    <main>
    <form onSubmit={onSubmitUsuario}>
    <Card>
        <CardContent>
            <Typography variant="h1">{location.state ? `Editar usuario: ${location.state.Apellido},  ${location.state.Nombre}` : "Agregar usuario"}</Typography>
            <Typography variant="h2"><i className="bx bx-user"></i> Datos del usuario</Typography>
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
                    inputProps={{ maxLength: 8 }}
                    onChange={onInputChange}
                    fullWidth
                    label="DNI">
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
                    type="number"
                    fullWidth
                    label="N° Teléfono">
                    </TextField>
                </Grid>
                <Grid item xs={12} md={4} lg={4} xl={4}>
                    <TextField
                    variant="outlined"
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
                    label="Contraseña">
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
                <Grid item xs={12} md={6} lg={6} xl={6}>
                    <FormHelperText>Seleccione roles del usuario</FormHelperText>
                    <Select 
                    variant="outlined"
                    fullWidth
                    value={RolesSeleccionados}
                    onChange={handleChangeRolesSeleccionados}
                    multiple
                    >
                        {roles.map((rol)=>(
                            <MenuItem key={rol.RoleId} value={rol.RoleId}>{rol.RoleName}</MenuItem>
                        ))}
                    </Select>
                </Grid>
                <Grid item xs={12} md={6} lg={6} xl={6}>
                <FormGroup style={{marginTop: '2rem'}}>
                    { location.state ?
                    <>
                    <FormControlLabel control={<Switch />} label="Dado de baja" />
                    <FormControlLabel control={<Switch />} label="Bloqueado" />
                    </>
                    : ""}
                    <FormControlLabel control={<Switch onChange={handleChangeCheckUsuarioDePrueba} value={EsUsuarioDePrueba}/>} label="Es usuario de prueba" />   
                </FormGroup>
                </Grid>
            </Grid>
        </CardContent>
        <div style={{textAlign: 'center', marginBottom: '1.5rem'}}>
            <Button type="submit" startIcon={<i className={location.state ? "bx bx-edit":"bx bx-check"}></i>}
            variant="contained" color="primary">
            {location.state ? "Modificar" : "Registrar"}
        </Button>
        </div>
    </Card>
    </form>
    </main>
    <Footer/>
    </div>
    </>
    );
}
 
export default CaratulaUser;