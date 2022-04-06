import React, { useState, useContext, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, Grid, MenuItem, TextField, Tooltip, Typography } from '@material-ui/core';
import Datatable from '../design/components/Datatable';
import Modal from '../design/components/Modal';
import AppContext from '../../../context/appContext';
import { Alert } from '@material-ui/lab';
import BotonesDatatable from '../design/components/BotonesDatatable';

const ListaModelosOnus = ({location}) => {
    const appContext = useContext(AppContext);
    const { usuarioLogueado, modelosONU, traerModelosONU, crearModeloONU, modificarModeloONU, eliminarModeloONU } = appContext;
    useEffect(()=>{
        //para abrir el modal directamente cuando se quiere dar de alta una ONU desde otra vista 
        location.state ? setModalModeloOnu(true) : setModalModeloOnu(false);
        traerModelosONU();
    },[])
    const [ModalModeloOnu, setModalModeloOnu] = useState(false);
    const [ModalEliminarModeloOnu, setModalEliminarModeloOnu] = useState(false);
    const [EditMode, setEditMode] = useState(false);
    const [ModeloOnuInfo, setModeloOnuInfo] = useState({
        ModeloOnuId: '',
        ModeloOnuNombre: '',
        ModeloOnuDescripcion: '',
        createdBy: null,
        updatedAt: null,
        updatedBy: null,
        deletedBy: null,
        deletedAt: null
    })
    const { ModeloOnuNombre, ModeloOnuDescripcion } = ModeloOnuInfo;

    const onInputChange= (e) =>{
        setModeloOnuInfo({
            ...ModeloOnuInfo,
            [e.target.name] : e.target.value
        });
    }

    const handleChangeModalModeloOnu = (data = '') => {
        setModalModeloOnu(!ModalModeloOnu);
        setModalEliminarModeloOnu(false);
        if(data !== '') {
            setEditMode(true);
            setModeloOnuInfo({...data, updatedBy: sessionStorage.getItem('identity'), updatedAt: new Date() });
        }
        else {
            setEditMode(false);
            setModeloOnuInfo({...data, createdBy: sessionStorage.getItem('identity')});
        }
    }

    const handleChangeModalEliminarModeloOnu = (data = '') => {
        setModalEliminarModeloOnu(!ModalEliminarModeloOnu);
        setModalModeloOnu(false);
        setModeloOnuInfo({...data, deletedBy: sessionStorage.getItem('identity'), deletedAt: new Date() });
    }

    const columnasModelosONUS = [
        {
            "name": "id",
            "selector": row => row["ModeloOnuId"],
            "omit": true
        },
        {
            "name": "Nombre",
            "selector": row => row["ModeloOnuNombre"],
            "wrap": true,
            "sortable": true
        },
        {
            "name": "Descripción",
            "selector": row => row["ModeloOnuDescripcion"],
            "wrap": true,
            "sortable": true
        },
        {
            cell: (data) => 
            <>
            <BotonesDatatable botones={
                <>
                <MenuItem>
                    <Typography onClick={()=>{handleChangeModalModeloOnu(data)}} style={{color: "#4D7F9E", cursor: 'pointer'}}><i className='bx bxs-pencil bx-xs' ></i> Editar</Typography>
                </MenuItem>
                <MenuItem>
                    <Typography onClick={()=>{handleChangeModalEliminarModeloOnu(data)}} style={{color: "red", cursor: 'pointer'}}><i className="bx bx-trash bx-xs"></i> Eliminar</Typography>
                </MenuItem>
                </>
            }/>
            </>,
        }
    ]
    return (
        <>
        <Card>
            <CardContent>
                <CardHeader
                    action={<Button variant="contained" startIcon={<i className="bx bx-plus"></i>} color="primary" onClick={()=>{handleChangeModalModeloOnu()}} >  Nuevo modelo de ONU</Button>}>
                </CardHeader>
                <Datatable
                    loader={true}
                    datos={modelosONU}
                    columnas={columnasModelosONUS}
                    paginacion={true}
                    buscar={true}
                />
            </CardContent>
        </Card>
        <Modal
        abrirModal={ModalModeloOnu}
        funcionCerrar={handleChangeModalModeloOnu}
        titulo={<Typography variant="h2"><i className="bx bxs-hdd"></i>{EditMode ? " Editar Modelo ONU" : "Nuevo Modelo ONU"}</Typography>}
        formulario={
            <Grid container spacing={3}>
                <Grid item xs={12} md={12} sm={12} xl={12}>
                    <TextField
                    color="primary"
                    autoFocus
                    variant="outlined"
                    label="Nombre"
                    fullWidth
                    onChange={onInputChange}
                    value={ModeloOnuNombre}
                    name="ModeloOnuNombre"
                    ></TextField>
                </Grid>
                <Grid item xs={12} md={12} sm={12} xl={12}>
                    <TextField
                    color="primary"
                    variant="outlined"
                    label="Descripción"
                    fullWidth
                    onChange={onInputChange}
                    value={ModeloOnuDescripcion}
                    name="ModeloOnuDescripcion"
                    ></TextField>
                </Grid>
            </Grid>
        }
        botones={
            <>
                <Button variant="contained" color="primary" onClick={()=>{EditMode ? modificarModeloONU(ModeloOnuInfo, handleChangeModalModeloOnu)
            : crearModeloONU(ModeloOnuInfo, handleChangeModalModeloOnu)}}>{EditMode ? "Editar" : "Confirmar"}</Button>
            <Button variant="text" color="inherit" >Cancelar</Button>
            </>
        }
        />
        <Modal
        abrirModal={ModalEliminarModeloOnu}
        funcionCerrar={handleChangeModalEliminarModeloOnu}
        titulo={<Alert severity="error">¿Está seguro que quiere eliminar el modelo de ONU?</Alert>}
        botones={
            <>
            <Button variant="contained" color="secondary" onClick={()=>{eliminarModeloONU(ModeloOnuInfo, handleChangeModalEliminarModeloOnu)}}>Eliminar</Button>
            <Button variant="text" color="inherit" onClick={handleChangeModalEliminarModeloOnu}>Cancelar</Button>
            </>
        }
        />
        </>
    );
}
 
export default ListaModelosOnus;