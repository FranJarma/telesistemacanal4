import React, { useState, useContext, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, Chip, Grid,  MenuItem, TextField, Typography } from '@material-ui/core';
import Datatable from '../design/components/Datatable';
import Aside from '../design/layout/Aside';
import Footer from '../design/layout/Footer';
import Modal from '../design/components/Modal';
import { DatePicker } from '@material-ui/pickers';
import AppContext from '../../../context/appContext';
import { Autocomplete } from '@material-ui/lab';
import { useLocation } from 'react-router-dom';
import convertirAHora from '../../../helpers/ConvertirAHora';
import Toast from '../design/components/Toast';

const ListaMovimientos = () => {
    const appContext = useContext(AppContext);
    const { mediosPago, movimientos, municipios, conceptos, traerMediosPago, traerMovimientosPorFecha, traerConceptos, traerMunicipiosPorProvincia, crearMovimiento } = appContext;
    const location = useLocation();

    const [MovimientoCantidad, setMovimientoCantidad] = useState({
        MovimientoPesos: null,
        MovimientoCentavos: '00'
    })

    const {MovimientoPesos, MovimientoCentavos} = MovimientoCantidad;

    const onInputChange = e => {
        setMovimientoCantidad({
            ...MovimientoCantidad,
            [e.target.name] : e.target.value
        });
    }

    const [diaMovimiento, setDiaMovimiento] = useState(new Date());
    const [MovimientoConcepto, setMovimientoConcepto] = useState(null);
    const [ModalMovimiento, setModalMovimiento] = useState(0);
    const [ModalCerrarCaja, setModalCerrarCaja] = useState(0);
    const [Municipio, setMunicipio] = useState(0);
    const [Turno, setTurno] = useState('Todos');
    const [MedioPagoId, setMedioPagoId] = useState(1);

    const handleChangeModalMovimiento = e => {
        if((Municipio === 0 && Turno === "Todos")||(Municipio === 0 && Turno !== "Todos")||(Municipio !== 0 && Turno === "Todos")) {
            Toast('Para agregar un gasto seleccione un municipio y un turno en específico', 'warning')
        }
        else{
            setModalMovimiento(!ModalMovimiento);
        }
    }
    const handleChangeModalCerrarCaja = e => {
        if((Municipio === 0 && Turno === "Todos")||(Municipio === 0 && Turno !== "Todos")||(Municipio !== 0 && Turno === "Todos")) {
            Toast('No es posible cerrar caja, por favor, seleccione un municipio y un turno en específico', 'warning')
        }
        else {
            setModalCerrarCaja(!ModalCerrarCaja);
        }
    }
    const handleChangeMunicipioSeleccionado = (e) => {
        setMunicipio(e.target.value);
        traerMovimientosPorFecha(diaMovimiento, e.target.value, Turno);
    }
    const handleChangeTurnoSeleccionado = (e) => {
        setTurno(e.target.value);
        traerMovimientosPorFecha(diaMovimiento, Municipio, e.target.value);
    }

    useEffect(()=> {
        traerMediosPago();
        traerMunicipiosPorProvincia(10);
        traerMovimientosPorFecha(diaMovimiento, Municipio, Turno); //traemos los movimientos del dia de TODOS los municipios
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
            "selector": row =>row["MovimientoCantidad"] > 0 ? <><i style={{color: 'green', fontWeight: 'bold'}} className='bx bx-up-arrow-alt'></i><span style={{color: 'green'}}> ${row["MovimientoCantidad"]} </span></> : <><i style={{color: 'red'}} className='bx bx-down-arrow-alt'></i><span style={{color: 'red'}}> ${(-1)*row["MovimientoCantidad"]}</span></>,
            "wrap": true
        },
        {
            "name": "Medio de Pago",
            "selector": row =>row["MedioPagoNombre"],
            "wrap": true
        },
        {
            "name": "Hora de movimiento",
            "selector": row => convertirAHora(row["createdAt"]),
            "wrap": true
        },
        {
            "name": "Quién cargo movimiento",
            "selector": row => row["ApellidoCarga"] + ", " +row["NombreCarga"],
            "wrap": true
        },
        {
            "name": "Abonado",
            "selector": row => row["ApellidoAbonado"] ? row["ApellidoAbonado"] + ", " +row["NombreAbonado"] : "-",
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
        <Typography variant="h6">Cierre de caja del día : {diaMovimiento.toLocaleDateString()} - Turno: {Turno}</Typography><br/>
        {Turno !== "Todos" ?
        <Grid container spacing={3}>
            <Grid item xs={6} sm={6} md={3} lg={3}>
                <Card>
                    <CardHeader
                        action={<Chip style={{backgroundColor: "red", color: "white", marginLeft: 15}} label="Cerrada"></Chip>}>
                    </CardHeader>
                    <CardContent>
                        <Typography>Recibida por: ADMIN</Typography>
                        <Typography>Cerrada por: ADMIN</Typography>
                        <Typography>A las: 21:45 hs</Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
        : ""}
        <br/>
        <Card>
            <CardContent>
                <CardHeader
                    action={
                    <>
                    <Button onClick={handleChangeModalCerrarCaja} startIcon={<i className="bx bx-calculator"></i>} variant="contained" color="secondary">Cerrar caja</Button>
                    <Button style={{marginLeft: '25px'}} onClick={handleChangeModalMovimiento} startIcon={<i className="bx bx-plus"></i>} variant="contained" color="primary"> Añadir gasto</Button>
                    </>}>
                </CardHeader>
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
                                setDiaMovimiento(newDia);
                                traerMovimientosPorFecha(newDia, Municipio, Turno);
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
                        <MenuItem key={0} value={0}>Todos</MenuItem>
                        {
                        municipios.length > 0 ?
                        municipios
                        .map((municipio)=>(
                            <MenuItem key={municipio.MunicipioId} value={municipio.MunicipioId}>{municipio.MunicipioNombre}</MenuItem>
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
                        <MenuItem value={'Todos'}><b>Todo el día</b> - 08:00 a 20:00</MenuItem>
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
                <i style={{color: 'green', fontWeight: 'bold', marginTop: 3}} className='bx bx-up-arrow-alt'></i><Typography variant="h6" style={{color: 'green'}}> Total de Ingresos: ${movimientos.filter(item => item.MovimientoCantidad > 0).map(item => item.MovimientoCantidad).reduce((prev, curr) => prev + curr, 0)}</Typography>
                <i style={{color: 'red', fontWeight: 'bold', marginTop: 3, marginLeft: 25}} className='bx bx-down-arrow-alt'></i><Typography variant="h6" style={{color: 'red'}}> Total de gastos : ${(-1)*movimientos.filter(item => item.MovimientoCantidad < 0).map(item => item.MovimientoCantidad).reduce((prev, curr) => prev + curr, 0)}</Typography>
            </div>
            </CardContent>
        </Card>
        <Modal
        abrirModal={ModalMovimiento}
        funcionCerrar={handleChangeModalMovimiento}
        titulo ={<Typography variant="h2"><i className='bx bx-money'></i> Añadir gasto en efectivo</Typography>}
        botones={
            <>
            <Button
            onClick={() => crearMovimiento({MovimientoCantidad: MovimientoCantidad, MovimientoConcepto: MovimientoConcepto, Municipio, MedioPagoId, createdBy: sessionStorage.getItem('identity')})}
            variant="contained"
            color="primary">Registrar</Button>
            <Button onClick={handleChangeModalMovimiento}>Cancelar</Button>
            </>
        }
        formulario={
        <>
        <Grid container spacing={3}>
            <Grid item xs={12} md={4} lg={4} xl={4}>
                <TextField
                variant="filled"
                disabled
                onChange={handleChangeMunicipioSeleccionado}
                value={Municipio}
                label="Municipio"
                fullWidth
                select
                >
                <MenuItem key={0} value={0}>Todos</MenuItem>
                {
                municipios.length > 0 ?
                municipios
                .map((municipio)=>(
                    <MenuItem key={municipio.MunicipioId} value={municipio.MunicipioId}>{municipio.MunicipioNombre}</MenuItem>
                )) : <MenuItem disabled>No se encontraron municipios</MenuItem>}
                </TextField>
            </Grid>
            <Grid item xs={12} md={4} lg={4} xl={4}>
                <TextField
                    disabled
                    variant="filled"
                    label="Medio de Pago"
                    value={MedioPagoId}
                    name="MedioPagoId"
                    fullWidth
                    select
                    >
                    {mediosPago
                    .filter((mp)=> mp.MedioPagoId !== 10)
                    .map((mp)=>(
                        <MenuItem key={mp.MedioPagoId} value={mp.MedioPagoId}>{mp.MedioPagoNombre}</MenuItem>
                    ))}
                </TextField>
            </Grid>
            <Grid item xs={12} md={4} lg={4} xl={4}>
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
            <Grid item xs={6} md={6} lg={6} xl={6}>
                <TextField
                onKeyPress={(e) => {
                    if (!/^[0-9]*$/.test(e.key)) {
                    e.preventDefault();
                }}}
                inputProps={{
                    maxLength: 8
                }}
                variant="outlined"
                color="primary"
                fullWidth
                name="MovimientoPesos"
                value={MovimientoPesos}
                label="Pesos"
                onChange={onInputChange}>
                </TextField>
            </Grid>
            <Grid item xs={6} md={6} lg={6} xl={6}>
                <TextField
                onKeyPress={(e) => {
                    if (!/^[0-9]*$/.test(e.key)) {
                    e.preventDefault();
                }}}
                inputProps={{
                    maxLength: 2
                }}
                variant="outlined"
                color="primary"
                fullWidth
                name="MovimientoCentavos"
                value={MovimientoCentavos}
                label="Centavos (modificar si corresponde)"
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
            variant="contained"
            color="primary">Cerrar caja</Button>
            <Button onClick={handleChangeModalCerrarCaja}>Cancelar</Button>
            </>
        }
        formulario={
            Municipio !== null && Turno !== null ?
        <>
            <Card>
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6} lg={6} xl={6}>
                            <TextField
                            variant="filled"
                            fullWidth
                            label="Día a cerrar"
                            value={diaMovimiento.toLocaleDateString()}
                            ></TextField>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} xl={6}>
                            <TextField
                            variant="filled"
                            disabled
                            value={Municipio}
                            label="Municipio"
                            fullWidth
                            select
                            >
                            <MenuItem key={0} value={0}>Todos</MenuItem>
                            {
                            municipios.length > 0 ?
                            municipios
                            .map((municipio)=>(
                                <MenuItem key={municipio.MunicipioId} value={municipio.MunicipioId}>{municipio.MunicipioNombre}</MenuItem>
                            )) : <MenuItem disabled>No se encontraron municipios</MenuItem>}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={4} lg={4} xl={4}>
                            <TextField
                            variant="filled"
                            value={Turno}
                            label="Turno"
                            fullWidth
                            >
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={4} lg={4} xl={4}>
                            <TextField
                            variant="filled"
                            value={sessionStorage.getItem('usr')}
                            label="Usuario a cerrar caja"
                            fullWidth
                            >
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={4} lg={4} xl={4}>
                            <TextField
                            variant="filled"
                            value={new Date().toLocaleTimeString()}
                            label="Horario de cierre"
                            fullWidth
                            >
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} xl={6}>
                            <TextField
                            variant="outlined"
                            value={movimientos.filter(item => item.MovimientoCantidad > 0).map(item => item.MovimientoCantidad).reduce((prev, curr) => prev + curr, 0)}
                            label="Total en caja"
                            fullWidth
                            >
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} xl={6}>
                            <TextField
                            variant="outlined"
                            value={movimientos.filter(item => item.MovimientoCantidad > 0).map(item => item.MovimientoCantidad).reduce((prev, curr) => prev + curr, 0)}
                            label="Total de ingresos registrado en sistema"
                            fullWidth
                            >
                            </TextField>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>:""}
        ></Modal>
        </main>
        <Footer/>
        </div>
        </>
    );
}
 
export default ListaMovimientos;