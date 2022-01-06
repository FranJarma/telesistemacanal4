import React, { useState, useContext, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, Grid, MenuItem, TextField, Tooltip, Typography } from '@material-ui/core';
import Datatable from '../design/components/Datatable';
import Modal from '../design/components/Modal';
import AppContext from '../../../context/appContext';
import { Alert } from '@material-ui/lab';

const ListaBarrios = () => {
    const appContext = useContext(AppContext);
    const { usuarioLogueado, barrios, municipios, traerBarriosPorMunicipio, traerMunicipiosPorProvincia, crearBarrio, modificarBarrio, eliminarBarrio } = appContext;
    useEffect(()=>{
        traerMunicipiosPorProvincia(10);
        traerBarriosPorMunicipio(0);
    },[]);

    const [MunicipioId, setMunicipioId] = useState(0);
    const [MunicipioNombre, setMunicipioNombre] = useState('El Carmen');
    const [MunicipioIdModal, setMunicipioIdModal] = useState(1);
    const [ModalBarrio, setModalBarrio] = useState(false);
    const [ModalEliminarBarrio, setModalEliminarBarrio] = useState(false);
    const [EditMode, setEditMode] = useState(false);
    const [BarrioInfo, setBarrioInfo] = useState({
        BarrioId: '',
        BarrioNombre: '',
        createdBy: null,
        updatedAt: null,
        updatedBy: null,
        deletedBy: null,
        deletedAt: null
    })
    const { BarrioNombre } = BarrioInfo;

    const onInputChange= (e) =>{
        setBarrioInfo({
            ...BarrioInfo,
            [e.target.name] : e.target.value
        });
    }

    const handleChangeModalBarrio = (data = '') => {
        setModalBarrio(!ModalBarrio);
        setModalEliminarBarrio(false);
        if(data !== '') {
            setEditMode(true);
            setBarrioInfo({...data, updatedBy: usuarioLogueado.User.UserId, updatedAt: new Date() });
            setMunicipioIdModal(data.MunicipioId);
            setMunicipioNombre(data.MunicipioNombre);
        }
        else {
            setEditMode(false);
            setBarrioInfo({...data, createdBy: usuarioLogueado.User.UserId});
        }
    }

    const handleChangeModalEliminarBarrio = (data = '') => {
        setModalEliminarBarrio(!ModalEliminarBarrio);
        setModalBarrio(false);
        setBarrioInfo({...data, deletedBy: usuarioLogueado.User.UserId, deletedAt: new Date() });
    }

    const handleChangeMunicipioSeleccionado = (e) => {
        setMunicipioId(e.target.value);
        traerBarriosPorMunicipio(e.target.value);
    }

    const handleFocusMunicipioSeleccionado = (e) => {
        setMunicipioNombre(e.target.innerHTML)
    }

    const handleChangeMunicipioIdModal = (e) => {
        setMunicipioIdModal(e.target.value);
    }

    const columnasBarrios = [
        {
            "name": "id",
            "selector": row => row["BarrioId"],
            "omit": true
        },
        {
            "name": "Nombre",
            "selector": row => row["BarrioNombre"],
            "wrap": true,
            "sortable": true
        },
        {
            "name": "Municipio",
            "selector": row => row["MunicipioNombre"],
            "wrap": true,
            "sortable": true
        },
        {
            cell: (data) => 
            <>
            <Typography onClick={()=>{handleChangeModalBarrio(data)}} style={{color: "teal", cursor: 'pointer'}}><Tooltip title="Editar"><i className='bx bxs-pencil bx-xs' ></i></Tooltip></Typography>
            <Typography onClick={()=>{handleChangeModalEliminarBarrio(data)}} style={{color: "red", cursor: 'pointer'}}><Tooltip title="Eliminar"><i className="bx bx-trash bx-xs"></i></Tooltip></Typography>
            </>,
        }
    ]
    return (
        <>
        <Card>
            <CardContent>
                <CardHeader
                    action={<Button variant="contained" color="primary" onClick={()=>{handleChangeModalBarrio()}} >+ Nuevo barrio</Button>}>
                </CardHeader>
                <br/>
                <Grid item xs={12} md={2} lg={2} xl={2}>
                    <TextField
                    onChange={handleChangeMunicipioSeleccionado}
                    value={MunicipioId}
                    label="Municipio"
                    fullWidth
                    select
                    variant="outlined"
                    >
                    <MenuItem value={0}>Todos</MenuItem>
                    {municipios.length > 0 ? municipios.map((municipio)=>(
                        <MenuItem key={municipio.MunicipioId} value={municipio.MunicipioId}>{municipio.MunicipioNombre}</MenuItem>
                    )): <MenuItem disabled>No se encontraron municipios</MenuItem>}
                    </TextField>
                </Grid>
                <Datatable
                    loader={true}
                    datos={barrios}
                    columnas={columnasBarrios}
                    paginacion={true}
                    buscar={true}
                />
            </CardContent>
        </Card>
        <Modal
        abrirModal={ModalBarrio}
        funcionCerrar={handleChangeModalBarrio}
        titulo={<Typography variant="h2"><i className="bx bx-map"></i>{EditMode ? " Editar Barrio" : " Nuevo Barrio"}</Typography>}
        formulario={
            <Grid container spacing={3}>
                <Grid item xs={12} md={12} sm={12} xl={12}>
                    <TextField
                    color="primary"
                    autoFocus
                    variant="outlined"
                    label="Nombre del Barrio"
                    fullWidth
                    onChange={onInputChange}
                    value={BarrioNombre}
                    name="BarrioNombre"
                    ></TextField>
                </Grid>
                <Grid item xs={12} md={12} sm={12} xl={12}>
                    <TextField
                    onChange={handleChangeMunicipioIdModal}
                    value={MunicipioIdModal}
                    label="Municipio"
                    fullWidth
                    select
                    variant="outlined"
                    onFocus={handleFocusMunicipioSeleccionado}
                    >
                    {municipios.length > 0 ? municipios.map((municipio)=>(
                        <MenuItem key={municipio.MunicipioId} value={municipio.MunicipioId}>{municipio.MunicipioNombre}</MenuItem>
                    )): <MenuItem disabled>No se encontraron municipios</MenuItem>}
                    </TextField>
                </Grid>
            </Grid>
        }
        botones={
            <>
            <Button variant="contained" color="primary" onClick={()=>{EditMode ? modificarBarrio({...BarrioInfo, MunicipioNombre, MunicipioIdModal}, handleChangeModalBarrio)
            : crearBarrio({...BarrioInfo, MunicipioNombre, MunicipioIdModal}, handleChangeModalBarrio)}}>{EditMode ? "Editar" : "Agregar"}</Button>
            <Button variant="text" color="inherit" onClick={handleChangeModalBarrio} >Cerrar</Button>
            </>
        }
        />
        <Modal
        abrirModal={ModalEliminarBarrio}
        funcionCerrar={handleChangeModalEliminarBarrio}
        titulo={<Alert severity="error">¿Está seguro que quiere eliminar el barrio?</Alert>}
        botones={
            <>
            <Button variant="contained" color="secondary" onClick={()=>{eliminarBarrio(BarrioInfo, handleChangeModalEliminarBarrio)}}>Eliminar</Button>
            <Button variant="text" color="inherit" onClick={handleChangeModalEliminarBarrio}>Cerrar</Button>
            </>
        }
        />
        </>
    );
}
 
export default ListaBarrios;