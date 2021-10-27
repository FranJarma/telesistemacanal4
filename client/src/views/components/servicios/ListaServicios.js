import React, { useState, useContext, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, Grid, TextField, Typography } from '@material-ui/core';
import Datatable from '../design/components/Datatable';
import Aside from '../design/layout/Aside';
import Footer from '../design/layout/Footer';
import Modal from '../design/components/Modal';
import AppContext from '../../../context/appContext';

const ListaServicios = () => {
    const appContext = useContext(AppContext);
    const { servicios, traerServicios, crearServicio } = appContext;
    useEffect(()=>{
        traerServicios();
    },[])
    const [ModalNuevoServicio, setModalNuevoServicio] = useState(false);
    const [ServicioInfo, setServicioInfo] = useState({
        ServicioNombre: '',
        ServicioPrecioUnitario: '',
        ServicioDescripcion: ''
    })
    const { ServicioNombre, ServicioPrecioUnitario, ServicioDescripcion } = ServicioInfo;

    const onInputChange= (e) =>{
        setServicioInfo({
            ...ServicioInfo,
            [e.target.name] : e.target.value
        });
    }

    const handleChangeModalNuevoServicio = () => {
        setModalNuevoServicio(!ModalNuevoServicio);
    }

    const columnasServicios = [
        {
            "name": "id",
            "selector": row => row["ServicioId"],
            "omit": true
        },
        {
            "name": "Nombre",
            "selector": row => row["ServicioNombre"]
        },
        {
            "name": "Precio Unitario",
            "selector": row => "$ " + row["ServicioPrecioUnitario"]
        },
        {
            "name": "Descripción",
            "selector": row => row["ServicioDescripcion"]
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
                    action={<Button variant="contained" color="primary" onClick={handleChangeModalNuevoServicio} >+ Nuevo servicio</Button>}>
                </CardHeader>
                <Typography variant="h1">Listado de Servicios</Typography>
                <Datatable
                    datos={servicios}
                    columnas={columnasServicios}
                    paginacion={true}
                    buscar={true}
                />
            </CardContent>
        </Card>
        <Modal
        abrirModal={ModalNuevoServicio}
        funcionCerrar={handleChangeModalNuevoServicio}
        titulo={<Typography variant="h2"><i className="bx bx-plug"></i> Nuevo Servicio</Typography>}
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
                <Grid item xs={12} md={12} sm={12} xl={12}>
                    <TextField
                    color="primary"
                    type="number"
                    variant="outlined"
                    label="Precio Unitario del Servicio"
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
            <Button variant="contained" color="primary" onClick={()=>{crearServicio(ServicioInfo)}}>Agregar</Button>
            <Button variant="text" color="inherit" >Cerrar</Button>
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