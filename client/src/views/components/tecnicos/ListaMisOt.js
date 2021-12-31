import React, { useState, useContext, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, Grid, TextField, Tooltip, Typography } from '@material-ui/core';
import Datatable from '../design/components/Datatable';
import Aside from '../design/layout/Aside';
import Footer from '../design/layout/Footer';
import Modal from '../design/components/Modal';
import AppContext from '../../../context/appContext';
import { Alert } from '@material-ui/lab';

const ListaMisTareas = () => {
    const appContext = useContext(AppContext);
    const { usuarioLogueado, servicios, traerServicios, crearServicio, modificarServicio, eliminarServicio } = appContext;
    useEffect(()=>{
        traerServicios();
    },[])
    const [ModalServicio, setModalServicio] = useState(false);
    const [ModalEliminarServicio, setModalEliminarServicio] = useState(false);
    const [EditMode, setEditMode] = useState(false);
    const [ServicioInfo, setServicioInfo] = useState({
        ServicioNombre: '',
        ServicioPrecioUnitario: '',
        ServicioRecargo: '',
        ServicioDescripcion: '',
        createdBy: null,
        updatedAt: null,
        updatedBy: null,
        deletedBy: null,
        deletedAt: null
    })
    const { ServicioNombre, ServicioPrecioUnitario, ServicioRecargo, ServicioDescripcion } = ServicioInfo;

    const onInputChange= (e) =>{
        setServicioInfo({
            ...ServicioInfo,
            [e.target.name] : e.target.value
        });
    }

    const handleChangeModalServicio = (data = '') => {
        setModalServicio(!ModalServicio);
        setModalEliminarServicio(false);
        if(data !== '') {
            setEditMode(true);
            setServicioInfo({...data, updatedBy: usuarioLogueado.User.UserId, updatedAt: new Date().toString() });
        }
        else {
            setEditMode(false);
            setServicioInfo({...data, createdBy: usuarioLogueado.User.UserId});
        }
    }

    const handleChangeModalEliminarServicio = (data = '') => {
        setModalEliminarServicio(!ModalEliminarServicio);
        setModalServicio(false);
        setServicioInfo({...data, deletedBy: usuarioLogueado.User.UserId, deletedAt: new Date().toString() });
    }

    const columnasServicios = [
        {
            "name": "id",
            "selector": row => row["ServicioId"],
            "omit": true
        },
        {
            "name": "Nombre",
            "selector": row => row["ServicioNombre"],
            "wrap": true,
            "sortable": true
        },
        {
            "name": "Precio",
            "selector": row => "$ " + row["ServicioPrecioUnitario"],
            "wrap": true,
            "sortable": true
        },
        {
            "name": "Recargo",
            "selector": row => "$ " + row["ServicioRecargo"],
            "wrap": true,
            "sortable": true
        },
        {
            "name": "Descripción",
            "selector": row => row["ServicioDescripcion"],
            "wrap": true,
            "sortable": true
        },
        {
            cell: (data) => 
            <>
            <Typography onClick={()=>{handleChangeModalServicio(data)}} style={{color: "teal", cursor: 'pointer'}}><Tooltip title="Editar"><i className='bx bxs-pencil bx-xs' ></i></Tooltip></Typography>
            <Typography onClick={()=>{handleChangeModalEliminarServicio(data)}} style={{color: "red", cursor: 'pointer'}}><Tooltip title="Eliminar"><i className="bx bx-trash bx-xs"></i></Tooltip></Typography>
            </>,
        }
    ]
    return (
        <>
        <div className="container">
        <Aside/>
        <main>
        <Card>
            <CardContent>
                <CardHeader
                    action={<Button variant="contained" color="primary" onClick={()=>{handleChangeModalServicio()}} >+ Nuevo servicio</Button>}>
                </CardHeader>
                <Typography variant="h1">Listado de Servicios</Typography>
                <Datatable
                    loader={true}
                    datos={servicios}
                    columnas={columnasServicios}
                    paginacion={true}
                    buscar={true}
                />
            </CardContent>
        </Card>
        <Modal
        abrirModal={ModalServicio}
        funcionCerrar={handleChangeModalServicio}
        titulo={<Typography variant="h2"><i className="bx bx-plug"></i>{EditMode ? "Editar Servicio" : "Nuevo Servicio"}</Typography>}
        formulario={
            <Grid container spacing={3}>
                <Grid item xs={12} md={12} sm={12} xl={12}>
                    <TextField
                    color="primary"
                    autoFocus
                    variant="outlined"
                    label="Nombre del Servicio"
                    fullWidth
                    onChange={onInputChange}
                    value={ServicioNombre}
                    name="ServicioNombre"
                    ></TextField>
                </Grid>
                <Grid item xs={6} md={6} sm={6} xl={6}>
                    <TextField
                    color="primary"
                    type="number"
                    variant="outlined"
                    label="Precio Unitario"
                    fullWidth
                    onChange={onInputChange}
                    value={ServicioPrecioUnitario}
                    name="ServicioPrecioUnitario"
                    ></TextField>
                </Grid>
                <Grid item xs={6} md={6} sm={6} xl={6}>
                    <TextField
                    color="primary"
                    type="number"
                    variant="outlined"
                    label="Recargo"
                    fullWidth
                    onChange={onInputChange}
                    value={ServicioRecargo}
                    name="ServicioRecargo"
                    ></TextField>
                </Grid>
                <Grid item xs={12} md={12} sm={12} xl={12}>
                    <TextField
                    color="primary"
                    multiline
                    minRows={3}
                    variant="outlined"
                    label="Descripción del Servicio"
                    fullWidth
                    inputProps={{
                        maxLength: 100
                    }}
                    onChange={onInputChange}
                    value={ServicioDescripcion}
                    name="ServicioDescripcion"
                    ></TextField>
                </Grid>
            </Grid>
        }
        botones={
            <>
            <Button variant="contained" color="primary" onClick={()=>{EditMode ? modificarServicio(ServicioInfo, handleChangeModalServicio)
            : crearServicio(ServicioInfo, handleChangeModalServicio)}}>{EditMode ? "Editar" : "Agregar"}</Button>
            <Button variant="text" color="inherit" >Cerrar</Button>
            </>
        }
        />
        <Modal
        abrirModal={ModalEliminarServicio}
        funcionCerrar={handleChangeModalEliminarServicio}
        titulo={<Alert severity="error">¿Está seguro que quiere eliminar el servicio?</Alert>}
        botones={
            <>
            <Button variant="contained" color="secondary" onClick={()=>{eliminarServicio(ServicioInfo, handleChangeModalEliminarServicio)}}>Eliminar</Button>
            <Button variant="text" color="inherit" onClick={handleChangeModalEliminarServicio}>Cerrar</Button>
            </>
        }
        />
        </main>
        <Footer/>
        </div>
        </>
    );
}
 
export default ListaMisTareas;