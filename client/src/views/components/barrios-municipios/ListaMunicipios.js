import React, { useState, useContext, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, Grid, MenuItem, TextField, Tooltip, Typography } from '@material-ui/core';
import Datatable from '../design/components/Datatable';
import Modal from '../design/components/Modal';
import AppContext from '../../../context/appContext';
import { Alert } from '@material-ui/lab';

const ListaMunicipios = () => {
    const appContext = useContext(AppContext);
    const { municipios, provincias, traerProvincias, traerMunicipiosPorProvincia, crearMunicipio, modificarMunicipio, eliminarMunicipio } = appContext;
    useEffect(()=>{
        traerProvincias();
        setProvinciaId(10);
        traerMunicipiosPorProvincia(10);
    },[]);

    const [ProvinciaId, setProvinciaId] = useState('');
    const [ModalMunicipio, setModalMunicipio] = useState(false);
    const [ModalEliminarMunicipio, setModalEliminarMunicipio] = useState(false);
    const [EditMode, setEditMode] = useState(false);
    const [MunicipioInfo, setMunicipioInfo] = useState({
        MunicipioNombre: '',
        MunicipioSigla: '',
        MunicipioCodigoPostal: ''
    })
    const { MunicipioNombre, MunicipioSigla, MunicipioCodigoPostal } = MunicipioInfo;

    const onInputChange= (e) =>{
        setMunicipioInfo({
            ...MunicipioInfo,
            [e.target.name] : e.target.value
        });
    }
    
    const handleChangeProvinciaSeleccionada = (e) => {
        setProvinciaId(e.target.value);
    }

    const handleChangeModalMunicipio = (data = '') => {
        setModalMunicipio(!ModalMunicipio);
        setModalEliminarMunicipio(false);
        if(data !== '') {
            setEditMode(true);
            setMunicipioInfo(data);
        }
        else {
            setEditMode(false);
        }
    }

    const handleChangeModalEliminarMunicipio = (data = '') => {
        setModalEliminarMunicipio(!ModalEliminarMunicipio);
        setModalMunicipio(false);
        setMunicipioInfo(data);
    }

    const columnasMunicipios = [
        {
            "name": "id",
            "selector": row => row["BarrioId"],
            "omit": true
        },
        {
            "name": "Nombre",
            "selector": row => row["MunicipioNombre"],
            "wrap": true,
            "sortable": true
        },
        {
            "name": "Sigla",
            "selector": row => row["MunicipioSigla"],
            "wrap": true,
            "sortable": true
        },
        {
            "name": "Código Postal",
            "selector": row => row["MunicipioCodigoPostal"],
            "wrap": true,
            "sortable": true
        },
        {
            "name": "Provincia",
            "selector": row => row["ProvinciaNombre"],
            "wrap": true,
            "sortable": true
        },
        {
            cell: (data) => 
            <>
            <Typography onClick={()=>{handleChangeModalMunicipio(data)}} style={{color: "teal", cursor: 'pointer'}}><Tooltip title="Editar"><i className='bx bxs-pencil bx-xs' ></i></Tooltip></Typography>
            <Typography onClick={()=>{handleChangeModalEliminarMunicipio(data)}} style={{color: "red", cursor: 'pointer'}}><Tooltip title="Eliminar"><i className="bx bx-trash bx-xs"></i></Tooltip></Typography>
            </>,
        }
    ]
    return (
        <>
        <Card>
            <CardContent>
                <CardHeader
                    action={<Button variant="contained" color="primary" onClick={()=>{handleChangeModalMunicipio()}} >+ Nuevo municipio</Button>}>
                </CardHeader>
                <br/>
                <Datatable
                    datos={municipios}
                    columnas={columnasMunicipios}
                    paginacion={true}
                    buscar={true}
                />
            </CardContent>
        </Card>
        <Modal
        abrirModal={ModalMunicipio}
        funcionCerrar={handleChangeModalMunicipio}
        titulo={<Typography variant="h2"><i className="bx bx-map-alt"></i>{EditMode ? " Editar Municipio" : " Nuevo Municipio"}</Typography>}
        formulario={
            <Grid container spacing={3}>
                <Grid item xs={12} md={12} sm={12} xl={12}>
                    <TextField
                    color="primary"
                    autoFocus
                    variant="outlined"
                    label="Nombre del Municipio"
                    fullWidth
                    onChange={onInputChange}
                    value={MunicipioNombre}
                    name="MunicipioNombre"
                    ></TextField>
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                    <TextField
                    color="primary"
                    variant="outlined"
                    label="Sigla del Municipio"
                    fullWidth
                    onChange={onInputChange}
                    value={MunicipioSigla}
                    name="MunicipioSigla"
                    ></TextField>
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                    <TextField
                    color="primary"
                    variant="outlined"
                    label="Código postal"
                    fullWidth
                    onChange={onInputChange}
                    value={MunicipioCodigoPostal}
                    name="MunicipioCodigoPostal"
                    ></TextField>
                </Grid>
                <Grid item xs={12} md={12} sm={12} xl={12}>
                    <TextField
                    onChange={handleChangeProvinciaSeleccionada}
                    value={ProvinciaId}
                    label="Provincia"
                    fullWidth
                    select
                    variant="outlined"
                    >
                    {provincias.length > 0 ? provincias.map((provincia)=>(
                        <MenuItem key={provincia.ProvinciaId} value={provincia.ProvinciaId}>{provincia.ProvinciaNombre}</MenuItem>
                    )): <MenuItem disabled>No se encontraron provincias</MenuItem>}
                    </TextField>
                </Grid>
            </Grid>
        }
        botones={
            <>
            <Button variant="contained" color="primary" onClick={()=>{EditMode ?
            modificarMunicipio({...MunicipioInfo, ProvinciaId}, handleChangeModalMunicipio)
            :
            crearMunicipio({...MunicipioInfo, ProvinciaId}, handleChangeModalMunicipio)}}
            >{EditMode ? "Editar" : "Agregar"}</Button>
            <Button variant="text" color="inherit" >Cerrar</Button>
            </>
        }
        />
        <Modal
        abrirModal={ModalEliminarMunicipio}
        funcionCerrar={handleChangeModalEliminarMunicipio}
        titulo={<Alert severity="error">¿Está seguro que quiere eliminar el municipio?</Alert>}
        botones={
            <>
            <Button variant="contained" color="secondary" onClick={()=>{eliminarMunicipio(MunicipioInfo, handleChangeModalEliminarMunicipio)}}>Eliminar</Button>
            <Button variant="text" color="inherit">Cerrar</Button>
            </>
        }
        />
        </>
    );
}
 
export default ListaMunicipios;