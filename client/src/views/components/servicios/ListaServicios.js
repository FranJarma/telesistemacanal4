import React, { useState, useContext, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, Grid, MenuItem, TextField, Tooltip, Typography } from '@material-ui/core';
import Datatable from '../design/components/Datatable';
import Aside from '../design/layout/Aside';
import Footer from '../design/layout/Footer';
import Modal from '../design/components/Modal';
import AppContext from '../../../context/appContext';
import { Alert } from '@material-ui/lab';
import BotonesDatatable from '../design/components/BotonesDatatable';

const ListaServicios = () => {
    const appContext = useContext(AppContext);
    const { usuarioLogueado, servicios, traerServicios, crearServicio, modificarServicio, eliminarServicio } = appContext;
    useEffect(()=>{
        traerServicios();
    },[]);
    const [ModalServicio, setModalServicio] = useState(false);
    const [ModalEliminarServicio, setModalEliminarServicio] = useState(false);
    const [EditMode, setEditMode] = useState(false);
    const [ServicioInfo, setServicioInfo] = useState({
        ServicioNombre: '',
        ServicioPrecioUnitario: '',
        ServicioDescripcion: '',
        createdBy: null,
        updatedAt: null,
        updatedBy: null,
        deletedBy: null,
        deletedAt: null
    })
    const { ServicioNombre, ServicioPrecioUnitario, ServicioDescripcion } = ServicioInfo;

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
            setServicioInfo({...data, updatedBy: sessionStorage.getItem('identity'), updatedAt: new Date() });
        }
        else {
            setEditMode(false);
            setServicioInfo({...data, createdBy: sessionStorage.getItem('identity')});
        }
    }

    const handleChangeModalEliminarServicio = (data = '') => {
        setModalEliminarServicio(!ModalEliminarServicio);
        setModalServicio(false);
        setServicioInfo({...data, deletedBy: sessionStorage.getItem('identity'), deletedAt: new Date() });
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
            "name": "Descripción",
            "selector": row => row["ServicioDescripcion"],
            "wrap": true,
            "sortable": true
        },
        {
            cell: (data) =>
            <>
            <BotonesDatatable botones={
            <>
            <MenuItem>
                <Typography onClick={()=>{handleChangeModalServicio(data)}} style={{color: "teal", cursor: 'pointer'}}><i className='bx bxs-pencil bx-xs'></i> Editar</Typography>
            </MenuItem>
            <MenuItem>
                <Typography onClick={()=>{handleChangeModalEliminarServicio(data)}} style={{color: "red", cursor: 'pointer'}}><i className="bx bx-trash bx-xs"></i> Eliminar</Typography>
            </MenuItem>
            </>
            }/>
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
                <Grid item xs={12} md={6} sm={6} xl={6}>
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
                <Grid item xs={12} md={6} sm={6} xl={6}>
                    <TextField
                    color="primary"
                    onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                    }}}
                    variant="outlined"
                    label="Precio Unitario"
                    fullWidth
                    onChange={onInputChange}
                    value={ServicioPrecioUnitario}
                    name="ServicioPrecioUnitario"
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
 
export default ListaServicios;