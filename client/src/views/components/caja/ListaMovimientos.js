import React, { useState, useContext, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, Grid,  MenuItem, TextField, Typography } from '@material-ui/core';
import Datatable from '../design/components/Datatable';
import Aside from '../design/layout/Aside';
import Footer from '../design/layout/Footer';
import Modal from '../design/components/Modal';
import { DatePicker } from '@material-ui/pickers';
import AppContext from '../../../context/appContext';
import { Autocomplete } from '@material-ui/lab';
import { useLocation } from 'react-router-dom';

const ListaMovimientos = () => {
    const appContext = useContext(AppContext);
    const { movimientos, municipios, conceptos, traerMovimientosPorFecha, traerConceptos, traerMunicipiosPorProvincia, crearMovimiento } = appContext;
    const location = useLocation();

    const [MovimientoCantidad, setMovimientoCantidad] = useState(null);
    const onInputChange = e => {
        setMovimientoCantidad(e.target.value);
    }
    const [diaMovimiento, setDiaMovimiento] = useState(new Date());
    const [MovimientoConcepto, setMovimientoConcepto] = useState(0);
    const [ModalMovimiento, setModalMovimiento] = useState(0);
    const [ModalCerrarCaja, setModalCerrarCaja] = useState(0);
    const [Municipio, setMunicipio] = useState({});
    const [Turno, setTurno] = useState(null);

    const handleChangeModalMovimiento = e => {
        setModalMovimiento(!ModalMovimiento);
    }
    const handleChangeModalCerrarCaja = e => {
        setModalCerrarCaja(!ModalCerrarCaja);
    }
    const handleChangeMunicipioSeleccionado = (e) => {
        setMunicipio(e.target.value);
    }
    const handleChangeTurnoSeleccionado = (e) => {
        setTurno(e.target.value);
    }

    useEffect(()=> {
        traerMunicipiosPorProvincia(10);
        setMunicipio(2); //por defecto tendriamos que poner el municipio del usuario logueado
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
            "selector": row =>row["MovimientoCantidad"] > 0 ? <><i style={{color: 'green', fontWeight: 'bold'}} className='bx bx-up-arrow-alt'></i><span style={{color: 'green'}}> ${row["MovimientoCantidad"]} </span></> : <><i style={{color: 'red'}} className='bx bx-down-arrow-alt'></i><span style={{color: 'red'}}> ${row["MovimientoCantidad"]}</span></>,
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
            "selector": row =>row["MovimientoCantidad"] > 0 ? <><span style={{color: 'green', fontWeight: 'bold'}}>{row["Tipo"] +": "}</span>{row["Concepto"]}</>  : <><span style={{color: 'red', fontWeight: 'bold'}}>{row["Tipo"] +": "}</span>{row["Concepto"]}</>,
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
                    action={
                    <>
                    <Button onClick={handleChangeModalCerrarCaja} startIcon={<i className="bx bx-calculator"></i>} variant="contained" color="secondary">Cerrar caja</Button>
                    <Button style={{marginLeft: '25px'}} onClick={handleChangeModalMovimiento} startIcon={<i className="bx bx-plus"></i>} variant="contained" color="primary"> Añadir movimiento</Button>
                    </>}>
                </CardHeader>
                <Typography variant="h1">Cierre de caja del día : {diaMovimiento.toLocaleDateString()}</Typography>
                <br/>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4} lg={4} xl={4}>
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
                    <Grid item xs={12} md={4} lg={4} xl={4}>
                        <TextField
                        variant = {location.state ? "filled" : "outlined"}
                        disabled = {location.state ? true : false}
                        onChange={handleChangeMunicipioSeleccionado}
                        value={Municipio}
                        label="Municipio"
                        fullWidth
                        select
                        >
                        {
                        municipios.length > 0 ?
                        municipios.map((municipio)=>(
                            <MenuItem key={municipio.MunicipioId} value={municipio}>{municipio.MunicipioNombre}</MenuItem>
                        )) : <MenuItem disabled>No se encontraron municipios</MenuItem>}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={4} lg={4} xl={4}>
                        <TextField
                        variant = "outlined"
                        onChange={handleChangeTurnoSeleccionado}
                        value={Turno}
                        label="Turno"
                        fullWidth
                        select
                        >
                        <MenuItem value={'Mañana'}><b>Mañana</b> - 08:00 a 12:00</MenuItem>
                        <MenuItem value={'Tarde'}><b>Tarde</b> - 16:00 a 20:00</MenuItem>
                        </TextField>
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
            <Typography variant="h2">Total de Ingresos : ${movimientos.map(item => item.MovimientoCantidad).reduce((prev, curr) => prev + curr, 0)}</Typography>
            <Typography style={{'margin-left': '25px'}} color='secondary' variant="h2">Total de gastos : ${movimientos.map(item => item.MovimientoCantidad).reduce((prev, curr) => prev + curr, 0)}</Typography>
            </div>
            </CardContent>
        </Card>
        <Modal
        abrirModal={ModalMovimiento}
        funcionCerrar={handleChangeModalMovimiento}
        titulo ={<Typography variant="h2"><i className='bx bx-money'></i> Añadir movimiento</Typography>}
        botones={
            <>
            <Button
            onClick={crearMovimiento}
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
        <Modal
        abrirModal={ModalCerrarCaja}
        funcionCerrar={handleChangeModalCerrarCaja}
        titulo ={<Typography variant="h2"><i className='bx bx-calculator'></i> Cerrar caja</Typography>}
        botones={
            <>
            <Button
            onClick={crearMovimiento}
            variant="contained"
            color="primary">Registrar</Button>
            <Button onClick={handleChangeModalCerrarCaja}>Cerrar</Button>
            </>
        }
        formulario={
        <>
        <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={5}>
                <Typography><b>Día a cerrar:</b> {diaMovimiento.toLocaleDateString()}</Typography>
                <Typography><b>Municipio:</b> {Municipio.MunicipioNombre}</Typography>
                <Typography><b>Turno:</b> {Turno}</Typography>
                <Typography><b>Usuario a cerrar caja:</b> {sessionStorage.getItem('usr')}</Typography>
                <Typography><b>Horario de cierre:</b> {new Date().toLocaleTimeString()}</Typography>
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