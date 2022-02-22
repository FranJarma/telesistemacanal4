import React, { useState, useContext, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, Grid, MenuItem, TextField, Typography } from '@material-ui/core';
import Datatable from '../design/components/Datatable';
import Aside from '../design/layout/Aside';
import Footer from '../design/layout/Footer';
import Modal from '../design/components/Modal';
import AppContext from '../../../context/appContext';
import { Alert } from '@material-ui/lab';
import BotonesDatatable from '../design/components/BotonesDatatable';

const ListaTiposTareas = () => {
    const appContext = useContext(AppContext);
    const { usuarioLogueado, tareas, traerTareas, crearTarea, modificarTarea, eliminarTarea } = appContext;

    useEffect(()=>{
        traerTareas();
    },[])

    const [ModalTarea, setModalTarea] = useState(false);
    const [ModalEliminarTarea, setModalEliminarTarea] = useState(false);
    const [EditMode, setEditMode] = useState(false);

    const [TareaInfo, setTareaInfo] = useState({
        TareaNombre: '',
        TareaPrecioUnitario: '',
        TareaDescripcion: '',
        TareaPrecioOt: '',
        EstadoId: '',
        createdBy: null,
        updatedAt: null,
        updatedBy: null,
        deletedBy: null,
        deletedAt: null
    })
    const { TareaNombre, TareaPrecioUnitario, TareaDescripcion, TareaPrecioOt } = TareaInfo;

    const onInputChange= (e) =>{
        setTareaInfo({
            ...TareaInfo,
            [e.target.name] : e.target.value
        });
    }

    const handleChangeModalTarea = (data = '') => {
        setModalTarea(!ModalTarea);
        setModalEliminarTarea(false);
        if(data !== '') {
            setEditMode(true);
            setTareaInfo(data);
        }
        else {
            setEditMode(false);
        }
    }

    const handleChangeModalEliminarTarea = (data = '') => {
        setModalEliminarTarea(!ModalEliminarTarea);
        setModalTarea(false);
        setTareaInfo(data);
    }


    const columnasTareas = [
        {
            "name": "id",
            "selector": row => row["TareaId"],
            "omit": true
        },
        {
            "name": "Tipo de tarea",
            "selector": row => row["TareaNombre"],
            "wrap": true,
            "sortable": true
        },
        {
            "name": "Descripcion",
            "selector": row => row["TareaDescripcion"],
            "wrap": true,
            "sortable": true,
        },
        {
            "name": "Precio Unitario",
            "selector": row => "$ " + row["TareaPrecioUnitario"],
            "wrap": true,
            "sortable": true
        },
        {
            "name": "Precio OT",
            "selector": row => "$ " + row["TareaPrecioOt"],
            "wrap": true,
            "sortable": true
        },
        {
            cell: (data) => 
            <BotonesDatatable botones={
            <>
            <MenuItem>
                <Typography onClick={()=>{handleChangeModalTarea(data)}} style={{color: "teal", cursor: 'pointer'}}><i className='bx bxs-pencil bx-xs' ></i> Editar</Typography>
            </MenuItem>
            <MenuItem>
                <Typography onClick={()=>{handleChangeModalEliminarTarea(data)}} style={{color: "red", cursor: 'pointer'}}><i className="bx bx-trash bx-xs"></i> Eliminar</Typography>
            </MenuItem>
            </>
            }/>
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
                    action={<Button variant="contained" startIcon={<i className="bx bx-plus"></i>} color="primary" onClick={()=>{handleChangeModalTarea()}} > Nueva tarea</Button>}>
                </CardHeader>
                <Typography variant="h1">Listado de Tareas</Typography>
                <Datatable
                    loader={true}
                    datos={tareas}
                    columnas={columnasTareas}
                    paginacion={true}
                    buscar={true}
                />
            </CardContent>
        </Card>
        <Modal
        abrirModal={ModalTarea}
        funcionCerrar={handleChangeModalTarea}
        titulo={<Typography variant="h2"><i className="bx bx-clipboard"></i>{EditMode ? "Editar Tarea" : "Nueva Tarea"}</Typography>}
        formulario={
            <Grid container spacing={3}>
                <Grid item xs={12} md={12} sm={12} xl={12}>
                    <TextField
                    color="primary"
                    autoFocus
                    variant="outlined"
                    label="Nombre de la Tarea"
                    fullWidth
                    onChange={onInputChange}
                    value={TareaNombre}
                    name="TareaNombre"
                    ></TextField>
                </Grid>
                <Grid item xs={6} md={6} sm={6} xl={6}>
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
                    value={TareaPrecioUnitario}
                    name="TareaPrecioUnitario"
                    ></TextField>
                </Grid>
                <Grid item xs={6} md={6} sm={6} xl={6}>
                    <TextField
                    color="primary"
                    onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                    }}}
                    variant="outlined"
                    label="Precio OT"
                    fullWidth
                    onChange={onInputChange}
                    value={TareaPrecioOt}
                    name="TareaPrecioOt"
                    ></TextField>
                </Grid>
                <Grid item xs={12} md={12} sm={12} xl={12}>
                    <TextField
                    color="primary"
                    multiline
                    minRows={3}
                    variant="outlined"
                    label="Descripción de la tarea"
                    fullWidth
                    inputProps={{
                        maxLength: 100
                    }}
                    onChange={onInputChange}
                    value={TareaDescripcion}
                    name="TareaDescripcion"
                    ></TextField>
                </Grid>
            </Grid>
        }
        botones={
            <>
            <Button variant="contained" color="primary" onClick={()=>{EditMode ? modificarTarea({...TareaInfo, updatedAt: new Date(),
            updatedBy: sessionStorage.getItem('identity')}, handleChangeModalTarea)
            : crearTarea({...TareaInfo,
            createdBy: sessionStorage.getItem('identity')}, handleChangeModalTarea)}}>{EditMode ? "Editar" : "Agregar"}</Button>
            <Button variant="text" color="inherit" >Cerrar</Button>
            </>
        }
        />
        <Modal
        abrirModal={ModalEliminarTarea}
        funcionCerrar={handleChangeModalEliminarTarea}
        titulo={<Alert severity="error">¿Está seguro que quiere eliminar la tarea?</Alert>}
        botones={
            <>
            <Button variant="contained" color="secondary" onClick={()=>{eliminarTarea({...TareaInfo, deletedAt: new Date(),
            deletedBy: sessionStorage.getItem('identity')}, handleChangeModalEliminarTarea)}}>Eliminar</Button>
            <Button variant="text" color="inherit" onClick={handleChangeModalEliminarTarea}>Cerrar</Button>
            </>
        }
        />
        </main>
        <Footer/>
        </div>
        </>
    );
}
 
export default ListaTiposTareas;