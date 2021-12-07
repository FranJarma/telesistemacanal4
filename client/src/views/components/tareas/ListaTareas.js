import React, { useState, useContext, useEffect } from 'react';
import { Box, Button, Card, CardContent, Grid, TextField, Tooltip, Typography } from '@material-ui/core';
import Datatable from '../design/components/Datatable';
import Aside from '../design/layout/Aside';
import Footer from '../design/layout/Footer';
import Modal from '../design/components/Modal';
import AppContext from '../../../context/appContext';
import { Alert } from '@material-ui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import MobileDateRangePicker from '@mui/lab/MobileDateRangePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import esLocale from 'date-fns/locale/es';

const ListaTareas = () => {
    const appContext = useContext(AppContext);
    const { usuarioLogueado, tareas, traerTareas, modificarTarea, eliminarTarea } = appContext;
    useEffect(()=>{
        traerTareas();
    },[])
    const [ModalTarea, setModalTarea] = useState(false);
    const [ModalEliminarTarea, setModalEliminarTarea] = useState(false);
    const [EditMode, setEditMode] = useState(false);
    const [TareaInfo, SetTareaInfo] = useState({
        createdBy: null,
        updatedAt: null,
        updatedBy: null,
        deletedBy: null,
        deletedAt: null
    })
    const [rangoFechas, setRangoFechas] = useState([null, null]);

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
            "name": "Fecha Estimada",
            "selector": row => row["FechaEstimadaTarea"].split('T')[0].split('-').reverse().join('/'),
            "wrap": true
        },
        {
            "name": "Tarea a realizar",
            "selector": row => row["TipoTareaNombre"],
            "wrap": true
        },
        {
            "name": "Nombre de Abonado",
            "selector": row => row["Nombre"] + " " + row["Apellido"],
            "wrap": true,
        },
        {
            "name": "Domicilio",
            "selector": row => row["DomicilioCalle"] + ', ' + row["DomicilioNumero"] + ' | ' +  "Barrio " + row["BarrioNombre"] + ' | ' +  row["MunicipioNombre"],
            "wrap": true,
        },
        {
            cell: (data) => 
            <>
            <Typography onClick={()=>{handleChangeModalTarea(data)}} style={{color: "teal", cursor: 'pointer'}}><Tooltip title="Asignar técnicos"><i className='bx bxs-wrench bx-xs' ></i></Tooltip></Typography>
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
                <div style={{display: 'flex'}}>
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={esLocale}>
                <MobileDateRangePicker
                    startText="Desde"
                    endText="Hasta"
                    value={rangoFechas}
                    onChange={(newValue) => {
                    setRangoFechas(newValue);
                    }}
                    renderInput={(startProps, endProps) => (
                    <React.Fragment>
                        <TextField {...startProps} />
                        <Box sx={{ mx: 2 }}></Box>
                        <TextField  {...endProps} />
                    </React.Fragment>
                    )}
                />
                </LocalizationProvider>
                    <Button style={{marginLeft: '2rem'}} variant="contained" color="secondary">Buscar</Button>
                </div>
            </CardContent>
        </Card>
        <br/>
        <Card>
            <CardContent>
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
 
export default ListaTareas;