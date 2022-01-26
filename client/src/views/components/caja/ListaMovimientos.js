import React, { useState, useContext, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, Grid,  MenuItem, TextField, Tooltip, Typography } from '@material-ui/core';
import Datatable from '../design/components/Datatable';
import Aside from '../design/layout/Aside';
import { useLocation } from 'react-router-dom';
import Footer from '../design/layout/Footer';
import Modal from '../design/components/Modal';
import { DatePicker } from '@material-ui/pickers';
import AppContext from '../../../context/appContext';
import { Autocomplete } from '@material-ui/lab';

const ListaMovimientos = () => {
    const appContext = useContext(AppContext);
    const { movimientos, traerMovimientosPorFecha, crearMovimiento, conceptos, traerConceptos } = appContext;

    const [MovimientoCantidad, setMovimientoCantidad] = useState(null);
    const onInputChange = e => {
        setMovimientoCantidad(e.target.value);
    }
    const [diaMovimiento, setDiaMovimiento] = useState(new Date());
    const [MovimientoConcepto, setMovimientoConcepto] = useState(0);
    const [modalMovimiento, setModalMovimiento] = useState(0);
    const handleChangeModalMovimiento = e => {
        setModalMovimiento(!modalMovimiento);
    }
    useEffect(()=> {
        traerMovimientosPorFecha(diaMovimiento);
        traerConceptos();
    },[]);

    const columnasMovimientos = [
        {
            "name": "N°",
            "selector": row =>row["MovimientoId"],
            "omit": true
        },
        {
            "name": "Cantidad",
            "selector": row =>row["MovimientoCantidad"] > 0 ? <><i style={{color: 'green'}} className='bx bx-up-arrow-alt'></i><span style={{color: 'green'}}> ${row["MovimientoCantidad"]} </span></> : <><i style={{color: 'red'}} className='bx bx-down-arrow-alt'></i><span style={{color: 'red'}}> ${row["MovimientoCantidad"]}</span></>,
            "wrap": true
        },
        {
            "name": "Hora de movimiento",
            "selector": row =>row["createdAt"].split('T')[1].split(':')[0] - 3 + ':' + row["createdAt"].split(':')[1],
            "wrap": true
        },
        {
            "name": "Usuario de carga",
            "selector": row => row["ApellidoCarga"] + ", " +row["NombreCarga"],
            "wrap": true
        },
        {
            "name": "Concepto",
            "selector": row => row["Concepto"],
            "wrap": true
        }
    ]
    return (
        <>
        <div className="container">
        <Aside/>
        <main>
        <br/>
        <Card>
            <CardContent>
                <CardHeader
                    action={<Button onClick={handleChangeModalMovimiento} variant="contained" color="primary">+ Añadir movimiento</Button>}>
                </CardHeader>
                <Typography variant="h1">Cierre de caja del día : {diaMovimiento.toLocaleDateString()}</Typography>
                <br/>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={2} lg={2}>
                        <DatePicker
                            color="primary"
                            inputVariant="outlined"
                            format="dd/MM/yyyy"
                            views={["date"]}
                            fullWidth
                            disableFuture
                            label="Día"
                            value={diaMovimiento}
                            onChange={newDia => {
                                setDiaMovimiento(newDia)
                                traerMovimientosPorFecha(newDia);
                            }}
                        ></DatePicker>
                    </Grid>
                </Grid>
                <Datatable
                    loader={true}
                    datos={movimientos}
                    columnas={columnasMovimientos}
                    paginacion={true}
                    buscar={true}
                />
            <div style={{display: 'flex'}}>
            <Typography variant="h2">Total de ventas : ${movimientos.map(item => item.MovimientoCantidad).reduce((prev, curr) => prev + curr, 0)}</Typography>
            <Typography style={{'margin-left': '25px'}} color='secondary' variant="h2">Total de gastos : ${movimientos.map(item => item.MovimientoCantidad).reduce((prev, curr) => prev + curr, 0)}</Typography>
            </div>
       
            </CardContent>
        </Card>
        <Modal
        abrirModal={modalMovimiento}
        funcionCerrar={handleChangeModalMovimiento}
        titulo ={<Typography variant="h2"><i className='bx bx-money'></i> Añadir movimiento</Typography>}
        botones={
            <>
            <Button
            variant="contained"
            color="primary">Registrar</Button>
            <Button onClick={handleChangeModalMovimiento}>Cerrar</Button>
            </>
        }
        formulario={
        <>
        <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={5}>
                <Autocomplete
                    disableClearable
                    value={MovimientoConcepto}
                    onChange={(_event, newConceptoId) => {
                        setMovimientoConcepto(newConceptoId);
                    }}
                    options={conceptos}
                    noOptionsText="No se encontraron conceptos"
                    getOptionLabel={(option) => option.MovimientoConceptoNombre}
                    renderInput={(params) => <TextField {...params} variant = "outlined" fullWidth label="Concepto"/>}
                />
            </Grid>
            <Grid item xs={12} sm={12} md={5}>
                <TextField
                onKeyPress={(event) => {
                    if (!/^[,0-9]+$/.test(event.key)) {
                    event.preventDefault();
                }}}
                variant="outlined"
                color="primary"
                fullWidth
                name="MovimientoCantidad"
                value={MovimientoCantidad}
                label="Cantidad"
                onChange={onInputChange}>
                </TextField>
            </Grid>
        </Grid>
        </>}
        ></Modal>
        </main>
        <Footer/>
        </div>
        </>
    );
}
 
export default ListaMovimientos;