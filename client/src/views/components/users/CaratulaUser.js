import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../../../context/appContext';
import Aside from '../design/layout/Aside';
import Footer from '../design/layout/Footer';
import { Button, Card, CardContent, FormControlLabel, Grid, FormGroup, FormHelperText, MenuItem, Select, Switch, TextField, Typography, FormControl, Badge, Chip } from '@material-ui/core'; 
import { useLocation } from 'react-router-dom';
import Datatable from '../design/components/Datatable';

const CaratulaUser = () => {
    const appContext = useContext(AppContext);
    const { roles, rolesUser, traerRoles, traerRolesPorUsuario, crearUsuario, modificarUsuario } = appContext;
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
    const [selectedRows, setSelectedRows] = React.useState(false);
    const handleChangeSelectedRows = ({ selectedRows }) => {
        setSelectedRows(selectedRows);
    };

    const [EsUsuarioDePrueba, setEsUsuarioDePrueba] = useState(0);
    const handleChangeCheckUsuarioDePrueba = (e) => {
        e.target.checked ? setEsUsuarioDePrueba(1) : setEsUsuarioDePrueba(0);
    }
    const onInputChange = (e) => {
        setUserInfo({
            ...UserInfo,
            [e.target.name] : e.target.value
        });
    }
    const { UserId, Nombre, Apellido, Documento, Email, Telefono, NombreUsuario, Contraseña, RContraseña} = UserInfo;

    const [RolesSeleccionados, setRolesSeleccionados] = useState([]);

    const handleChangeRolesSeleccionados = (e) => {
        setRolesSeleccionados(e.target.value);
    };

    useEffect(()=> {
        traerRoles();
        if (location.state) traerRolesPorUsuario(location.state.UserId);
    }, [])

    useEffect(() => {
        if(location.state)
        {
            setUserInfo({
                UserId: location.state.UserId,
                Nombre: location.state.Nombre,
                Apellido: location.state.Apellido,
                Documento: location.state.Documento,
                Email: location.state.Email,
                Telefono: location.state.Telefono,
                NombreUsuario: location.state.NombreUsuario,
            });
            setRolesSeleccionados(rolesUser);
            setEsUsuarioDePrueba(location.state.EsUsuarioDePrueba);
        }
    }, [location.state])

    const onSubmitUsuario = (e) => {
        e.preventDefault();
        if(!location.state) {
            crearUsuario({
                Nombre,
                Apellido,
                Documento,
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
    const columnasRoles= [
        {
        "name": "RoleId",
        "selector": row => row["RoleId"],
        "omit": true
        },
        {
        "name": "Rol",
        "selector": row => row["RoleName"],
        },
        {
        "name": "Descripcion",
        "selector": row => row["RoleDescription"],
        },

]
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
                    onChange={onInputChange}
                    fullWidth
                    label="DNI"
                    type="number">
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
                </Grid>
                <Typography variant="h2"><i className="bx bxs-user"></i> Roles</Typography>
                <Grid item xs={12} md={12} lg={12} xl={12}>
                    <Card>
                        <Datatable
                        datos={roles}
                        columnas={columnasRoles}
                        selectableRows={true}
                        handleChangeSelectedRows={handleChangeSelectedRows}></Datatable>
                    </Card>
                    {/* <FormControl fullWidth>
                        <FormHelperText id="select-roles-label">Seleccione roles</FormHelperText>
                        multiple
                        value={RolesSeleccionados}
                        onChange={handleChangeRolesSeleccionados}
                        variant="outlined"
                        >
                            {roles.map((rol=>(
                                <MenuItem key={rol.RoleId} value={rol.RoleId}>{rol.RoleName}</MenuItem>
                            )))}
                        </Select>
                    </FormControl> */}
                </Grid>
                {/* {location.state ? 
                <>
                <br/>
                <Typography variant="h6">Roles actuales: {rolesUser.map((rol)=>(
                    <Chip style={{marginLeft: '1rem'}} color="secondary" label={rol.RoleName}></Chip> 
                ))}
                </Typography>
                <br/>
                </>
                : ""} */}
                <Grid item xs={12} md={6} lg={6} xl={6}>
                <FormGroup style={{marginTop: '1rem'}}>
                    { location.state ?
                    <>
                    <FormControlLabel control={<Switch color="primary" />} label="Bloqueado" />
                    </>
                    : ""}
                    <FormControlLabel control={<Switch color="primary" onChange={handleChangeCheckUsuarioDePrueba} checked={EsUsuarioDePrueba}/>} label="Es usuario de prueba" />   
                </FormGroup>
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
    <br/>
    <Footer/>
    </div>
    </>
    );
}
 
export default CaratulaUser;