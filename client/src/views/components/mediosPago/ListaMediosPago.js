import React, { useState, useContext, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, Grid, MenuItem, TextField, Typography } from '@material-ui/core';
import Datatable from '../design/components/Datatable';
import Aside from '../design/layout/Aside';
import Footer from '../design/layout/Footer';
import Modal from '../design/components/Modal';
import AppContext from '../../../context/appContext';
import { Alert } from '@material-ui/lab';
import BotonesDatatable from '../design/components/BotonesDatatable';

const ListaMediosPago = () => {
    const appContext = useContext(AppContext);
    const { mediosPago, traerMediosPago, crearMedioPago, modificarMedioPago, eliminarMedioPago } = appContext;
    useEffect(()=>{
        traerMediosPago();
    },[]);
    const [ModalMedioPago, setModalMedioPago] = useState(false);
    const [ModalEliminarMedioPago, setModalEliminarMedioPago] = useState(false);
    const [EditMode, setEditMode] = useState(false);
    const [MedioPagoInfo, setMedioPagoInfo] = useState({
        MedioPagoNombre: '',
        MedioPagoDescripcion: '',
        MedioPagoInteres: 0,
        MedioPagoCantidadCuotas: 1,
        createdBy: null,
        updatedAt: null,
        updatedBy: null,
        deletedBy: null,
        deletedAt: null
    })
    const { MedioPagoNombre, MedioPagoDescripcion, MedioPagoCantidadCuotas, MedioPagoInteres } = MedioPagoInfo;

    const onInputChange= (e) =>{
        setMedioPagoInfo({
            ...MedioPagoInfo,
            [e.target.name] : e.target.value
        });
    }

    const handleChangeModalMedioPago = (data = '') => {
        setModalMedioPago(!ModalMedioPago);
        setModalEliminarMedioPago(false);
        if(data !== '') {
            setEditMode(true);
            setMedioPagoInfo({...data, updatedBy: localStorage.getItem('identity'), updatedAt: new Date() });
        }
        else {
            setEditMode(false);
            setMedioPagoInfo({...data, createdBy: localStorage.getItem('identity')});
        }
    }

    const handleChangeModalEliminarMedioPago = (data = '') => {
        setModalEliminarMedioPago(!ModalEliminarMedioPago);
        setModalMedioPago(false);
        setMedioPagoInfo({...data, deletedBy: localStorage.getItem('identity'), deletedAt: new Date() });
    }

    const columnasMedioPago = [
        {
            "name": "id",
            "selector": row => row["MedioPagoId"],
            "omit": true
        },
        {
            "name": "Nombre",
            "selector": row => row["MedioPagoNombre"],
            "wrap": true,
            "sortable": true
        },
        {
            "name": "Descripción",
            "selector": row => row["MedioPagoDescripcion"],
            "wrap": true,
            "sortable": true
        },
        {
            "name": "Cantidad de cuotas",
            "selector": row => row["MedioPagoCantidadCuotas"],
            "wrap": true,
            "sortable": true
        },
        {
            "name": "Interés",
            "selector": row => row["MedioPagoInteres"] ? row["MedioPagoInteres"] +"%" : "No tiene",
            "wrap": true,
            "sortable": true
        },
        {
            cell: (data) =>
            <>
            <BotonesDatatable botones={
            <>
            <MenuItem>
                <Typography onClick={()=>{handleChangeModalMedioPago(data)}} style={{color: "#4D7F9E", cursor: 'pointer'}}><i className='bx bxs-pencil bx-xs'></i> Editar</Typography>
            </MenuItem>
            <MenuItem>
                <Typography onClick={()=>{handleChangeModalEliminarMedioPago(data)}} style={{color: "red", cursor: 'pointer'}}><i className="bx bx-trash bx-xs"></i> Eliminar</Typography>
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
        <Typography variant="h6">Listado de Medios de Pago</Typography>
        <br/>
        <Card>
            <CardContent>
                <CardHeader
                    action={<Button variant="contained" startIcon={<i className="bx bx-plus"></i>} color="primary" onClick={()=>{handleChangeModalMedioPago()}} > Nuevo medio de pago</Button>}>
                </CardHeader>
                <Datatable
                    loader={true}
                    datos={mediosPago}
                    columnas={columnasMedioPago}
                    paginacion={true}
                    buscar={true}
                />
            </CardContent>
        </Card>
        <Modal
        abrirModal={ModalMedioPago}
        funcionCerrar={handleChangeModalMedioPago}
        titulo={<Typography variant="h2"><i className="bx bx-money"></i>{EditMode ? "Editar Medio de Pago" : "Nuevo Medio de Pago"}</Typography>}
        formulario={
            <Grid container spacing={3}>
                <Grid item xs={12} md={4} sm={4} xl={4}>
                    <TextField
                    color="primary"
                    autoFocus
                    variant="outlined"
                    label="Nombre del Medio de Pago"
                    fullWidth
                    onChange={onInputChange}
                    value={MedioPagoNombre}
                    name="MedioPagoNombre"
                    ></TextField>
                </Grid>
                <Grid item xs={12} md={4} sm={4} xl={4}>
                    <TextField
                    color="primary"
                    onKeyPress={(e) => {
                        if (!/^[.0-9]+$/.test(e.key)) {
                            e.preventDefault();
                        }}}
                    variant="outlined"
                    label="Cantidad de cuotas"
                    fullWidth
                    onChange={onInputChange}
                    value={MedioPagoCantidadCuotas}
                    name="MedioPagoCantidadCuotas"
                    ></TextField>
                </Grid>
                <Grid item xs={12} md={4} sm={4} xl={4}>
                    <TextField
                    color="primary"
                    onKeyPress={(e) => {
                        if (!/^[.0-9]+$/.test(e.key)) {
                            e.preventDefault();
                        }}}
                    variant="outlined"
                    label="Interés del Medio de Pago"
                    fullWidth
                    onChange={onInputChange}
                    value={MedioPagoInteres}
                    name="MedioPagoInteres"
                    ></TextField>
                </Grid>
                <Grid item xs={12} md={12} sm={12} xl={12}>
                    <TextField
                    color="primary"
                    multiline
                    minRows={3}
                    variant="outlined"
                    label="Descripción del Medio de Pago"
                    fullWidth
                    inputProps={{
                        maxLength: 100
                    }}
                    onChange={onInputChange}
                    value={MedioPagoDescripcion}
                    name="MedioPagoDescripcion"
                    ></TextField>
                </Grid>
            </Grid>
        }
        botones={
            <>
            <Button variant="contained" color="primary" onClick={()=>{EditMode ? modificarMedioPago(MedioPagoInfo, handleChangeModalMedioPago)
            : crearMedioPago(MedioPagoInfo, handleChangeModalMedioPago)}}>{EditMode ? "Editar" : "Agregar"}</Button>
            <Button onClick={handleChangeModalMedioPago} variant="text" color="inherit" >Cancelar</Button>
            </>
        }
        />
        <Modal
        abrirModal={ModalEliminarMedioPago}
        funcionCerrar={handleChangeModalEliminarMedioPago}
        titulo={<Alert severity="error">¿Está seguro que quiere eliminar el medio de pago?</Alert>}
        botones={
            <>
            <Button variant="contained" color="secondary" onClick={()=>{eliminarMedioPago(MedioPagoInfo, handleChangeModalEliminarMedioPago)}}>Eliminar</Button>
            <Button variant="text" color="inherit" onClick={handleChangeModalEliminarMedioPago}>Cancelar</Button>
            </>
        }
        />
        </main>
        <Footer/>
        </div>
        </>
    );
}
 
export default ListaMediosPago;