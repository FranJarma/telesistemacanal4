import React, { useState, useContext, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, Grid, MenuItem, TextField, Tooltip, Typography } from '@material-ui/core';
import Datatable from '../design/components/Datatable';
import Modal from '../design/components/Modal';
import AppContext from '../../../context/appContext';
import { Alert } from '@material-ui/lab';

const ListaOnus = ({location}) => {
    const appContext = useContext(AppContext);
    const { onus, traerONUS, modelosONU, traerModelosONU, servicios, traerServicios, crearONU, modificarONU, eliminarONU } = appContext;
    useEffect(()=>{
        //para abrir el modal directamente cuando se quiere dar de alta una ONU desde otra vista 
        location.state ? setModalOnu(true) : setModalOnu(false);
        traerONUS();
        traerModelosONU();
        traerServicios();
    },[])
    const [ModalOnu, setModalOnu] = useState(false);
    const [ModalEliminarOnu, setModalEliminarOnu] = useState(false);
    const [EditMode, setEditMode] = useState(false);
    const [OnuInfo, setOnuInfo] = useState({
        OnuId: '',
        OnuSerie: '',
        OnuMac: ''
    })
    const [ServicioId, setServicioId] = useState(2);
    const { OnuSerie, OnuMac } = OnuInfo;
    const [ModeloOnuId, setModeloOnuId] = useState(1);

    const onInputChange= (e) =>{
        setOnuInfo({
            ...OnuInfo,
            [e.target.name] : e.target.value
        });
    }
    const handleChangeModeloOnuIdSeleccionado = (e) => {
        setModeloOnuId(e.target.value);
    }
    const handleChangeServicioIdSeleccionado = (e) => {
        setServicioId(e.target.value);
    }
    const handleChangeModalOnu = (data = '') => {
        console.log(data);
        setModalOnu(!ModalOnu);
        setModalEliminarOnu(false);
        if(data !== '') {
            setEditMode(true);
            setOnuInfo(data);
            setModeloOnuId(data.ModeloOnuId);
        }
        else {
            setEditMode(false);
        }
    }

    const handleChangeModalEliminarOnu = (data = '') => {
        setModalEliminarOnu(!ModalEliminarOnu);
        setModalOnu(false);
        setOnuInfo(data);
    }

    const columnasONUS = [
        {
            "name": "id",
            "selector": row => row["OnuId"],
            "omit": true
        },
        {
            "name": "Serie",
            "selector": row => row["OnuSerie"],
            "wrap": true,
            "sortable": true
        },
        {
            "name": "MAC",
            "selector": row => row["OnuMac"],
            "wrap": true,
            "sortable": true
        },
        {
            "name": "Modelo",
            "selector": row => row["ModeloOnuNombre"],
            "wrap": true,
            "sortable": true
        },
        {
            "name": "Abonado",
            "selector": row => row["Nombre"] ? row["Nombre"] + ', ' + row["Apellido"] : '-',
            "wrap": true,
            "sortable": true
        },
        {
            cell: (data) => 
            <>
            <Typography onClick={()=>{handleChangeModalOnu(data)}} style={{color: "teal", cursor: 'pointer'}}><Tooltip title="Editar"><i className='bx bxs-pencil bx-xs' ></i></Tooltip></Typography>
            <Typography onClick={()=>{handleChangeModalEliminarOnu(data)}} style={{color: "red", cursor: 'pointer'}}><Tooltip title="Eliminar"><i className="bx bx-trash bx-xs"></i></Tooltip></Typography>
            </>,
        }
    ]
    return (
        <>
        <Card>
            <CardContent>
                <CardHeader
                    action={<Button variant="contained" color="primary" onClick={()=>{handleChangeModalOnu()}} > + Nueva onu</Button>}>
                </CardHeader>
                <Typography variant="h1">Listado de ONUS</Typography>
                <Datatable
                    datos={onus}
                    columnas={columnasONUS}
                    paginacion={true}
                    buscar={true}
                />
            </CardContent>
        </Card>
        <Modal
        abrirModal={ModalOnu}
        funcionCerrar={handleChangeModalOnu}
        titulo={<Typography variant="h2"><i className="bx bx-broadcast"></i>{EditMode ? " Editar ONU" : "Nueva ONU"}</Typography>}
        formulario={
            <Grid container spacing={3}>
                <Grid item xs={12} md={12} sm={12} xl={12}>
                    <TextField
                    color="primary"
                    autoFocus
                    variant="outlined"
                    label="Serie"
                    fullWidth
                    onChange={onInputChange}
                    value={OnuSerie}
                    name="OnuSerie"
                    ></TextField>
                </Grid>
                <Grid item xs={12} md={12} sm={12} xl={12}>
                    <TextField
                    color="primary"
                    variant="outlined"
                    label="MAC"
                    fullWidth
                    onChange={onInputChange}
                    value={OnuMac}
                    name="OnuMac"
                    inputProps={{ maxLength: 12 }}
                    ></TextField>
                </Grid>
                <Grid item xs={12} md={12} sm={12} xl={12}>
                    <TextField
                    color="primary"
                    type="number"
                    variant="outlined"
                    label="Servicio"
                    fullWidth
                    onChange={handleChangeServicioIdSeleccionado}
                    value={ServicioId}
                    select
                    >
                    {servicios.length > 0 ? servicios
                    .filter((servicio)=> servicio.ServicioId !== 1)
                    .map((servicio)=>(
                        <MenuItem key={servicio.ServicioId} value={servicio.ServicioId}>{servicio.ServicioNombre}</MenuItem>
                    )): <MenuItem disabled>No se encontraron modelos de ONU</MenuItem>}
                    </TextField>
                </Grid>
                <Grid item xs={12} md={12} sm={12} xl={12}>
                    <TextField
                    color="primary"
                    type="number"
                    variant="outlined"
                    label="Modelo ONU"
                    fullWidth
                    onChange={handleChangeModeloOnuIdSeleccionado}
                    value={ModeloOnuId}
                    select
                    >
                    {modelosONU.length > 0 ? modelosONU.map((modeloOnu)=>(
                        <MenuItem key={modeloOnu.ModeloOnuId} value={modeloOnu.ModeloOnuId}>{modeloOnu.ModeloOnuNombre}</MenuItem>
                    )): <MenuItem disabled>No se encontraron modelos de ONU</MenuItem>}
                    </TextField>
                </Grid>
            </Grid>
        }
        botones={
            <>
            <Button variant="contained" color="primary" onClick={()=>{EditMode ? modificarONU({...OnuInfo, ServicioId, ModeloOnuId}, handleChangeModalOnu)
            : crearONU({...OnuInfo, ServicioId, ModeloOnuId}, handleChangeModalOnu)}}>{EditMode ? "Editar" : "Agregar"}</Button>
            <Button variant="text" color="inherit" >Cerrar</Button>
            </>
        }
        />
        <Modal
        abrirModal={ModalEliminarOnu}
        funcionCerrar={handleChangeModalEliminarOnu}
        titulo={<Alert severity="error">¿Está seguro que quiere eliminar la ONU?</Alert>}
        botones={
            <>
            <Button variant="contained" color="secondary" onClick={()=>{eliminarONU(OnuInfo, handleChangeModalEliminarOnu)}}>Eliminar</Button>
            <Button variant="text" color="inherit">Cerrar</Button>
            </>
        }
        />
        </>
    );
}
 
export default ListaOnus;