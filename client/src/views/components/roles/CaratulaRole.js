import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../../../context/appContext';
import Aside from '../design/layout/Aside';
import Footer from '../design/layout/Footer';
import { Button, Card, CardContent, Grid, TextField, Typography} from '@material-ui/core'; 
import { useLocation } from 'react-router-dom';
import Modal from '../design/components/Modal';
import { Alert } from '@material-ui/lab';
import DataTable from 'react-data-table-component';

const CaratulaRole = () => {
    const appContext = useContext(AppContext);
    const { permisos, permisosRol, traerPermisos, traerPermisosPorRol, crearRol, modificarRol } = appContext;
    const location = useLocation();
    const [RoleInfo, setRoleInfo] = useState({
        RoleId: null,
        RoleName: null,
        RoleDescription: null
    });
    const [PrimerRender, setPrimerRender] = useState(true);
    const [ModalAsignarPermisos, setModalAsignarPermisos] = useState(false);
    const [PermisosSeleccionados, setPermisosSeleccionados] = useState([]);

    const handleChangeModalAsignarPermisos = (e) => {
        if(!ModalAsignarPermisos && location.state && PrimerRender) {
            setPermisosSeleccionados(permisosRol);
            setPrimerRender(false);
        }
        setModalAsignarPermisos(!ModalAsignarPermisos);
    }
    const onInputChange = (e) => {
        setRoleInfo({
            ...RoleInfo,
            [e.target.name] : e.target.value
        });
    }
    const { RoleId, RoleName, RoleDescription} = RoleInfo;
    
    useEffect(()=> {
        traerPermisos();
        if(location.state){
            traerPermisosPorRol(location.state.RoleId);
            setRoleInfo({
                RoleId: location.state.RoleId,
                RoleName: location.state.RoleName,
                RoleDescription: location.state.RoleDescription
            });
        }
    },[]);
   
    const onSubmitUsuario = (e) => {
        e.preventDefault();
        if(!location.state) {
            crearRol({
                RoleName,
                RoleDescription,
                PermisosSeleccionados
            });
        }
        else {
            modificarRol({
                RoleId,
                RoleName,
                RoleDescription,
                PermisosSeleccionados
            });
        }
    }
    const columnasPermisos= [
        {
            selector: row => row['PermissionId'],
            name: 'ID',
            omit: true
        },
        {
            selector: row => row['PermissionName'],
            name: 'Nombre',
            wrap: true
        },
        {
            selector: row => row['PermissionDescription'],
            name: 'Descripcion',
            wrap: true
        },
]
const paginacionOpciones = {
    rowsPerPageText: 'Registros por página',
    rangeSeparatorText: 'de',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Mostrar todos'
}

    return ( 
    <>
    <div className="container">
    <Aside/>
    <main>
    <form onSubmit={onSubmitUsuario}>
    <Card>
        <CardContent>
            <Typography variant="h1">{location.state ? `Editar rol: ${location.state.RoleName}` : "Agregar rol"}</Typography>
            <Typography variant="h2"><i className="bx bx-user"></i> Datos del rol</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={6} xl={6}>
                    <TextField
                    autoFocus
                    variant="outlined"
                    value={RoleName}
                    name="RoleName"
                    onChange={onInputChange}
                    fullWidth
                    label="Nombre">
                    </TextField>
                </Grid>
                <Grid item xs={12} md={6} lg={6} xl={6}>
                    <TextField
                    variant="outlined"
                    value={RoleDescription}
                    name="RoleDescription"
                    onChange={onInputChange}
                    fullWidth
                    label="Descripción">
                    </TextField>
                </Grid>
                </Grid>
                <br/>
                <Button onClick={handleChangeModalAsignarPermisos} variant="outlined" startIcon={<i className="bx bxs-user"></i>} color="primary">{location.state ? "Ver Permisos" : "Asignar Permisos"}</Button>
                <Modal
                abrirModal={ModalAsignarPermisos}
                funcionCerrar={handleChangeModalAsignarPermisos}
                titulo={<Alert severity="success" icon={<i className="bx bxs-user bx-sm"></i>}>Permisos del rol</Alert>}
                formulario={
                <DataTable
                columns={columnasPermisos}
                data={permisos}
                onSelectedRowsChange={row => setPermisosSeleccionados(row.selectedRows)}
                paginationComponentOptions={paginacionOpciones}
                pagination={true}
                selectableRows
                selectableRowSelected={row => PermisosSeleccionados.find((permiso) => row.PermissionId === permiso.PermissionId)}>
                </DataTable>
                }
                ></Modal>
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
 
export default CaratulaRole;