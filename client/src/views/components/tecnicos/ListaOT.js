import React, { useState, useContext, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, Grid, TextField, Tooltip, Typography } from '@material-ui/core';
import Datatable from '../design/components/Datatable';
import Aside from '../design/layout/Aside';
import Footer from '../design/layout/Footer';
import Modal from '../design/components/Modal';
import AppContext from '../../../context/appContext';
import { Alert } from '@material-ui/lab';
import { Link } from 'react-router-dom';

const ListaOT = () => {
    const appContext = useContext(AppContext);
    const { usuarioLogueado, tareas, traerTareas, modificarTarea, eliminarTarea } = appContext;
    useEffect(()=>{
        traerTareas();
    },[])
    const [ModalTarea, setModalTarea] = useState(false);
    const [ModalEliminarTarea, setModalEliminarTarea] = useState(false);
    const [EditMode, setEditMode] = useState(false);
    const [TareaInfo, SetTareaInfo] = useState({
        EstadoId: '',
        createdBy: null,
        updatedAt: null,
        updatedBy: null,
        deletedBy: null,
        deletedAt: null
    })
    const { EstadoId } = TareaInfo;

    const handleChangeModalTarea = (data = '') => {
        setModalTarea(!ModalTarea);
        setModalEliminarTarea(false);
        if(data !== '') {
            setEditMode(true);
            SetTareaInfo({...data, updatedBy: usuarioLogueado.User.UserId, updatedAt: new Date().toString() });
        }
        else {
            setEditMode(false);
            SetTareaInfo({...data, createdBy: usuarioLogueado.User.UserId});
        }
    }

    const handleChangeModalEliminarTarea = (data = '') => {
        setModalEliminarTarea(!ModalEliminarTarea);
        setModalTarea(false);
        SetTareaInfo({...data, deletedBy: usuarioLogueado.User.UserId, deletedAt: new Date().toString() });
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
        },
        {
            "name": "Descripcion",
            "selector": row => row["TareaDescripcion"],
        },
        {
            "name": "Precio Unitario",
            "selector": row => "$ " + row["TareaPrecioUnitario"],
        },
        {
            cell: (data) => 
            <>
            <Typography onClick={()=>{handleChangeModalTarea(data)}} style={{color: "teal", cursor: 'pointer'}}><Tooltip title="Editar"><i className='bx bxs-pencil bx-xs' ></i></Tooltip></Typography>
            <Typography onClick={()=>{handleChangeModalTarea(data)}} style={{color: "navy", cursor: 'pointer'}}><Tooltip title="Finalizar OT"><i className='bx bx-calendar-check bx-xs' ></i></Tooltip></Typography>
            <Typography onClick={()=>{handleChangeModalEliminarTarea(data)}} style={{color: "red", cursor: 'pointer'}}><Tooltip title="Eliminar"><i className="bx bx-trash bx-xs"></i></Tooltip></Typography>
            </>,
        }
    ]
    return (
        <>
        <div className="container">
        <Aside/>
        <main>
        <Card>
            <CardHeader action={<Link style={{textDecoration: 'none'}} to="/caratula-ot"><Button variant="contained" color="primary">+ Nueva OT</Button></Link>}></CardHeader>
            <CardContent>
                <Typography variant="h1">Listado de Órdenes de Trabajo</Typography>
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
        titulo={<Typography variant="h2"><i className="bx bx-plug"></i>{EditMode ? "Editar Servicio" : "Nuevo Servicio"}</Typography>}
    
        botones={
            <>
            <Button variant="contained" color="primary" onClick={()=>{EditMode ? modificarTarea(TareaInfo, handleChangeModalTarea)
            : modificarTarea(TareaInfo, handleChangeModalTarea)}}>{EditMode ? "Editar" : "Agregar"}</Button>
            <Button variant="text" color="inherit" >Cerrar</Button>
            </>
        }
        />
        <Modal
        abrirModal={ModalEliminarTarea}
        funcionCerrar={handleChangeModalEliminarTarea}
        titulo={<Alert severity="error">¿Está seguro que quiere eliminar el servicio?</Alert>}
        botones={
            <>
            <Button variant="contained" color="secondary" onClick={()=>{eliminarTarea(TareaInfo, handleChangeModalEliminarTarea)}}>Eliminar</Button>
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
 
export default ListaOT;