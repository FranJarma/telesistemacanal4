import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../../../context/appContext';
import Aside from '../design/layout/Aside';
import Footer from '../design/layout/Footer';
import { Button, Card, CardContent, Grid, TextField, Typography} from '@material-ui/core'; 
import { useLocation } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import paginacionOpciones from '../design/components/PaginacionOpciones';

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

    const handleChangeTabsPermisos = (e) => {
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

    return ( 
    <>
    <div className="container">
    <Aside/>
    <main>
    <form onSubmit={onSubmitUsuario}>
    <Typography variant="h6">{location.state ? `Editar rol: ${location.state.RoleName}` : "Crear rol"}</Typography><br/>
    <Tabs>
    <TabList>
        <Tab><i className="bx bxs-user"></i> Rol</Tab>
        <Tab onClick={handleChangeTabsPermisos}><i className='bx bxs-lock'></i> Permisos</Tab>
    </TabList>
    <TabPanel>
    <Card>
        <CardContent>
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
        </CardContent>
        <div style={{textAlign: 'center', marginBottom: '1.5rem'}}>
            <Button type="submit" startIcon={<i className={location.state ? "bx bx-edit":"bx bx-check"}></i>}
            variant="contained" color="primary">
            {location.state ? "Modificar" : "Registrar"}
        </Button>
        </div>
    </Card>
    </TabPanel>
    <TabPanel>
        <Card>
        <DataTable
            columns={columnasPermisos}
            data={permisos}
            onSelectedRowsChange={row => setPermisosSeleccionados(row.selectedRows)}
            paginationComponentOptions={paginacionOpciones}
            pagination={true}
            selectableRows
            selectableRowSelected={row => PermisosSeleccionados.find((permiso) => row.PermissionId === permiso.PermissionId)}>
        </DataTable>
        </Card>
    </TabPanel>
    </Tabs>
    </form>
    </main>
    <br/>
    <Footer/>
    </div>
    </>
    );
}
 
export default CaratulaRole;