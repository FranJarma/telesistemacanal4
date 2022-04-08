import React, { useState, useContext, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, Chip, Grid,  MenuItem, TextField, Typography } from '@material-ui/core';
import Datatable from '../design/components/Datatable';
import Aside from '../design/layout/Aside';
import Footer from '../design/layout/Footer';
import Modal from '../design/components/Modal';
import { DatePicker } from '@material-ui/pickers';
import AppContext from '../../../context/appContext';
import { Alert, Autocomplete } from '@material-ui/lab';
import { useLocation } from 'react-router-dom';
import convertirAHora from '../../../helpers/ConvertirAHora';
import convertirAFecha from '../../../helpers/ConvertirAFecha';
import Toast from '../design/components/Toast';
import * as VARIABLES from './../../../types/variables';
import Spinner from '../design/components/Spinner';

const ListaMovimientos = () => {
    const appContext = useContext(AppContext);
    const { cajas, mediosPago, movimientos, municipios, conceptos, usuarios, traerMediosPago, traerMovimientosPorFecha, traerConceptos, traerMunicipiosPorProvincia, crearMovimiento, traerUsuariosPorRol, traerCaja, cerrarCaja, cargando, mostrarSpinner} = appContext;
    const location = useLocation();

    const [MovimientoCantidad, setMovimientoCantidad] = useState({
        MovimientoPesos: null,
        MovimientoCentavos: '00'
    })

    const {MovimientoPesos, MovimientoCentavos} = MovimientoCantidad;

    const onInputNuevoMovimientoChange = e => {
        setMovimientoCantidad({
            ...MovimientoCantidad,
            [e.target.name] : e.target.value
        });
    }

    const onInputCerrarCajaChange = e => {
        setCajaInfo({
            ...CajaInfo,
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

    const [CajaInfo, setCajaInfo] = useState({
        CajaDia: new Date().getDate(),
        CajaMes: new Date().getMonth() + 1,
        CajaAño: new Date().getFullYear(),
        CajaCerradaUser: localStorage.getItem('identity'),
        CajaCerradaFullName: localStorage.getItem('usr'),
        CajaRecibeUser: null,
        CajaRecibeFullName: null,
        CajaPesos: null,
        CajaCentavos: '00',
        CajaTotalSistema: null,
        CajaTurno: null,
        CajaMunicipio: null,
        CajaCierreObservaciones: null
    });

    const {CajaRecibeUser, CajaPesos, CajaCentavos, CajaCierreObservaciones} = CajaInfo;

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
            traerUsuariosPorRol(VARIABLES.ID_ROL_SECRETARIO);
            setCajaInfo({
                ...CajaInfo,
                CajaTotalSistema: movimientos.filter(item => item.MovimientoCantidad > 0).map(item => item.MovimientoCantidad).reduce((prev, curr) => prev + curr, 0)
            })
        }
    }
    const handleChangeMunicipioSeleccionado = (e) => {
        setMunicipio(e.target.value);
        setCajaInfo({
            ...CajaInfo,
            CajaMunicipio: e.target.value
        })
        traerMovimientosPorFecha(diaMovimiento, e.target.value, Turno);
        if(Turno !== "Todos"){
            traerCaja(e.target.value, diaMovimiento, Turno);
            mostrarSpinner();
        }
    }
    const handleChangeTurnoSeleccionado = (e) => {
        setTurno(e.target.value);
        setCajaInfo({
            ...CajaInfo,
            CajaTurno: e.target.value
        })
        traerMovimientosPorFecha(diaMovimiento, Municipio, e.target.value);
        if(Municipio !== 0){
            traerCaja(Municipio, diaMovimiento, e.target.value);
            mostrarSpinner();
        }
    }

    useEffect(()=> {
        traerMediosPago();
        traerMunicipiosPorProvincia(10);
        traerMovimientosPorFecha(diaMovimiento, Municipio, Turno); //traemos los movimientos del dia de TODOS los municipios
        traerConceptos();;
        traerCaja();
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
        <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
            {cajas.length > 0 && Turno !== "Todos" && Municipio !== 0 && !cargando ?
                <Card>
                    <CardContent>
                    <Chip style={{backgroundColor: "red", color: "white", marginBottom: 25}} label="LA CAJA SE ENCUENTRA CERRADA"></Chip>
                        <Typography variant="h6"><b>Recibida por:</b> {cajas[0].CajaCerradaFullName}</Typography>
                        <Typography variant="h6"><b>Cerrada por:</b> {cajas[0].CajaRecibeFullName}</Typography>
                        <Typography variant="h6"><b>Fecha y hora de cierre:</b> {convertirAFecha(cajas[0].CajaCerradaFecha)}-{convertirAHora(cajas[0].CajaCerradaFecha)}</Typography>
                    </CardContent>
                </Card>
            : !cargando?
            <Card>
                <Alert  severity='info'>No hay información disponible de la Caja</Alert>
            </Card>
        : <><Card><CardContent><Spinner></Spinner></CardContent></Card></>}
        </Grid>
        </Grid>
        <br/>
        <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
                <Card>
                <CardContent>
                    {(cajas.length === 0 && Municipio !== 0 && Turno !== "Todos") || (cajas.length > 0 && !cajas[0].CajaCerradaFecha) ?
                    <CardHeader
                        action={
                        <>
                        <Button onClick={handleChangeModalCerrarCaja} startIcon={<i className="bx bx-calculator"></i>} variant="contained" color="secondary">Cerrar caja</Button>
                        <Button style={{marginLeft: '25px'}} onClick={handleChangeModalMovimiento} startIcon={<i className="bx bx-plus"></i>} variant="contained" color="primary"> Añadir gasto</Button>
                        </>}>
                    </CardHeader>
                    : ""}
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
                                    setCajaInfo({
                                        ...CajaInfo,
                                        CajaAño: newDia.getFullYear(),
                                        CajaMes: newDia.getMonth()+1,
                                        CajaDia: newDia.getDate()
                                    })
                                    if(Municipio !== 0 && Turno !== "Todos"){
                                        traerCaja(Municipio, newDia, Turno);
                                        mostrarSpinner();
                                    }
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
            </Grid>
        </Grid>
        <Modal
        abrirModal={ModalMovimiento}
        funcionCerrar={handleChangeModalMovimiento}
        titulo ={<Typography variant="h2"><i className='bx bx-money'></i> Añadir gasto en efectivo</Typography>}
        botones={
            <>
            <Button
            onClick={() => crearMovimiento({MovimientoCantidad: MovimientoCantidad, MovimientoConcepto: MovimientoConcepto, Municipio, MedioPagoId, createdBy: localStorage.getItem('identity')})}
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
                onChange={onInputNuevoMovimientoChange}>
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
                onChange={onInputNuevoMovimientoChange}>
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
            onClick={() => {
                cerrarCaja(CajaInfo, handleChangeModalCerrarCaja);
            }}
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
                        <Autocomplete
                            disableClearable
                            onChange={(_event, newUser) => {
                                setCajaInfo({
                                    ...CajaInfo,
                                    CajaRecibeUser: newUser,
                                    CajaRecibeFullName: newUser.Apellido + ', ' + newUser.Nombre
                                })
                            }}
                            value={CajaRecibeUser}
                            options={usuarios}
                            noOptionsText="No se encontraron usuarios que puedan recibir caja"
                            getOptionLabel={(option) => option.Apellido + ", " + option.Nombre}
                            renderInput={(params) => <TextField {...params} variant = "outlined" fullWidth label="Usuario que recibe la caja"/>}
                            />
                        </Grid>
                        <Grid item xs={12} md={4} lg={4} xl={4}>
                            <TextField
                            variant="filled"
                            value={localStorage.getItem('usr')}
                            label="Usuario que cierra caja"
                            fullWidth
                            >
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={2} lg={2} xl={2}>
                            <TextField
                            variant="filled"
                            value={new Date().toLocaleTimeString()}
                            label="Horario de cierre"
                            fullWidth
                            >
                            </TextField>
                        </Grid>
                        <Grid item xs={6} md={4} lg={4} xl={4}>
                            <TextField
                            onKeyPress={(e) => {
                            if (!/^[0-9]+$/.test(e.key)) {
                                e.preventDefault();
                            }}}
                            variant="outlined"
                            value={CajaPesos}
                            name="CajaPesos"
                            inputProps={{
                                maxLength: 7
                            }}
                            onChange={onInputCerrarCajaChange}
                            label="Total de pesos en caja"
                            fullWidth
                            >
                            </TextField>
                        </Grid>
                        <Grid item xs={6} md={2} lg={2} xl={2}>
                            <TextField
                            onKeyPress={(e) => {
                            if (!/^[0-9]+$/.test(e.key)) {
                                e.preventDefault();
                            }}}
                            inputProps={{
                                maxLength: 2
                            }}
                            variant="outlined"
                            value={CajaCentavos}
                            name="CajaCentavos"
                            onChange={onInputCerrarCajaChange}
                            label="Total de centavos en caja"
                            fullWidth
                            >
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={4} lg={4} xl={4}>
                            <TextField
                            variant="outlined"
                            value={movimientos.filter(item => item.MovimientoCantidad > 0).map(item => item.MovimientoCantidad).reduce((prev, curr) => prev + curr, 0)}
                            label="Total de ingresos registrado en sistema"
                            fullWidth
                            >
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={12} sm={12} lg={12}>
                            <TextField
                                variant="outlined"
                                multiline
                                minRows={3}
                                label="Observaciones"
                                value={CajaCierreObservaciones}
                                name="CajaCierreObservaciones"
                                fullWidth
                                inputProps={{
                                    maxLength: 100
                                }}
                                onChange={onInputCerrarCajaChange}
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