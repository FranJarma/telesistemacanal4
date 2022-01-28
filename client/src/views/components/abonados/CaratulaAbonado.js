import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../../../context/appContext';
import Aside from '../design/layout/Aside';
import Footer from '../design/layout/Footer';
import { Button, Card, CardContent, Checkbox, FormControlLabel, FormHelperText, Grid, MenuItem, TextField, Typography } from '@material-ui/core'; 
import { DatePicker } from '@material-ui/pickers';
import { useLocation } from 'react-router-dom';
import { Alert } from '@material-ui/lab';
import { Autocomplete } from '@material-ui/lab';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

const CaratulaAbonado = () => {
    const appContext = useContext(AppContext);
    const { barrios, condicionesIva, municipios, servicios, provincias, onus, mediosPago, traerBarriosPorMunicipio, traerCondicionesIva, traerMunicipiosPorProvincia, traerServicios,
    traerProvincias, traerONUS, traerONUPorId, crearAbonado, modificarAbonado, traerMediosPago } = appContext;
    
    const location = useLocation();
    const [abonadoInfo, setAbonadoInfo] = useState({
        UserId: null,
        Nombre: null,
        Apellido: null,
        Documento: null,
        Cuit: null,
        Email: null,
        Telefono: null,
        DomicilioCalle: null,
        DomicilioNumero: null,
        DomicilioPiso: null,
        createdBy: sessionStorage.getItem('identity'),
        updatedAt: null,
        updatedBy: null
    })
    const onInputChange = (e) => {
        setAbonadoInfo({
            ...abonadoInfo,
            [e.target.name] : e.target.value
        });
    }
    const { UserId, Nombre, Apellido, Documento, Cuit, Email, Telefono, DomicilioCalle, DomicilioNumero, DomicilioPiso, createdBy, updatedAt, updatedBy} = abonadoInfo;
    //seteamos en 10 para que traiga jujuy directamente
    const [ProvinciaId, setProvinciaId] = useState(10);
    //para más adelante cuando vayan a otras provincias
    /*
    const handleChangeProvinciaSeleccionada = (e) => {
        setProvinciaId(e.target.value);
        setMunicipio(0);
        setBarrio(0);
        traerMunicipiosPorProvincia(e.target.value);
    }*/
    const [Municipio, setMunicipio] = useState({
        Municipio: null,
        MunicipioNombre: null
    });
    const [Barrio, setBarrio] = useState(null);
    const [Servicio, setServicio] = useState({
        ServicioId: null,
        ServicioNombre: null,
        ServicioPrecioUnitario: null,
        ServicioInscripcion: null
    });
    const [CondicionIvaId, setCondicionIvaId] = useState(0);
    const [MedioPagoId, setMedioPagoId] = useState(0);
    const [Onu, setOnu] = useState(null);
    const [FechaNacimiento, setFechaNacimiento] = useState(new Date());
    const [FechaContrato, setFechaContrato] = useState(new Date());
    const [FechaBajada, setFechaBajada] = useState(new Date());
    const [DosCuotas, setDosCuotas] = useState(false);
    const [MovimientoCantidad, setMovimientoCantidad] = useState(null);

    const handleChangeMunicipioSeleccionado = (e) => {
        setMunicipio(e.target.value);
        setBarrio(null);
        traerBarriosPorMunicipio(e.target.value);
    }
    const handleChangeBarrioSeleccionado = (e) => {
        setBarrio(e.target.value);
    }
    const handleChangeServicioSeleccionado = (e) => {
        setServicio(e.target.value);
        setMovimientoCantidad(e.target.value.ServicioPrecioUnitario + e.target.value.ServicioInscripcion);
    }
    const handleChangeCondicionIVASeleccionado = (e) => {
        setCondicionIvaId(e.target.value);
    }
    const handleChangeMedioPagoSeleccionado = (e) => {
        setMedioPagoId(e.target.value);
    }

    useEffect(() => {
        traerProvincias();
        traerMunicipiosPorProvincia(ProvinciaId);
        //traerBarriosPorMunicipio(Municipio);
        traerMediosPago();
        traerServicios();
        traerCondicionesIva();
        traerONUS(5); //hay que traer ONUS no asignadas a ningún abonado
    }, [])
    
    useEffect(() => {
        if(location.state)
        {
            console.log(location.state);
            setAbonadoInfo({
                UserId: location.state.UserId,
                Nombre: location.state.Nombre,
                Apellido: location.state.Apellido,
                Documento: location.state.Documento,
                Cuit: location.state.Cuit,
                Email: location.state.Email,
                Telefono: location.state.Telefono,
                DomicilioCalle: location.state.DomicilioCalle,
                DomicilioNumero: location.state.DomicilioNumero,
                DomicilioPiso: location.state.DomicilioPiso,
                updatedAt: new Date(),
                updatedBy: sessionStorage.getItem('identity')
            });
            setServicio({
                ServicioId: location.state.ServicioId,
                ServicioNombre: location.state.ServicioNombre,
                ServicioPrecioUnitario: location.state.ServicioPrecioUnitario,
                ServicioInscripcion: location.state.ServicioInscripcion,
            });
            setCondicionIvaId(location.state.CondicionIvaId);
            setFechaNacimiento(location.state.FechaNacimiento);
            setFechaBajada(location.state.FechaBajada);
            setFechaContrato(location.state.FechaContrato);
            traerONUPorId(location.state.OnuId);
        }
    }, [location.state])

    const onSubmitAbonado = (e) => {
        e.preventDefault();
        if(!location.state) {
            crearAbonado({
                Nombre,
                Apellido,
                Documento,
                Cuit,
                Email,
                Telefono,
                DomicilioCalle,
                DomicilioNumero,
                DomicilioPiso,
                FechaNacimiento,
                FechaContrato,
                FechaBajada,
                CondicionIvaId,
                ProvinciaId,
                Municipio,
                Barrio,
                Servicio,
                Onu,
                createdBy
            });
        }
        else {
            modificarAbonado({
                UserId,
                Nombre,
                Apellido,
                Documento,
                Cuit,
                Email,
                Telefono,
                FechaNacimiento,
                FechaContrato,
                FechaBajada,
                CondicionIvaId,
                Servicio,
                updatedAt,
                updatedBy
            });
        }
    }
    return ( 
    <>
    <div className="container">
    <Aside/>
    <main>
    <form onSubmit={onSubmitAbonado}>
    <Tabs>
        <TabList>
            <Tab><i style={{color: 'teal'}} className="bx bxs-user"></i> Datos del abonado</Tab>
            <Tab><i style={{color: 'teal'}} className='bx bxs-home'></i> Datos del domicilio</Tab>
            <Tab><i style={{color: 'teal'}} className='bx bxs-plug'></i> Datos del servicio</Tab>
        </TabList>
    <TabPanel>
        <Card>
            <CardContent>
                <Typography variant="h1">{location.state ? `Editar abonado: ${location.state.Apellido},  ${location.state.Nombre}` : "Agregar abonado"}</Typography>
                    <br/>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6} lg={6} xl={6}>
                            <TextField
                            autoFocus
                            variant="outlined"
                            value={Nombre}
                            name="Nombre"
                            onChange={onInputChange}
                            fullWidth
                            label="Nombre">
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} xl={6}>
                            <TextField
                            variant="outlined"
                            value={Apellido}
                            name="Apellido"
                            onChange={onInputChange}
                            fullWidth
                            label="Apellido">
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} xl={6}>
                            <TextField
                            onChange={onInputChange}
                            value={Documento}
                            onKeyPress={(e) => {
                            if (!/^[,0-9]+$/.test(e.key)) {
                                e.preventDefault();
                            }}}
                            variant="outlined"
                            name="Documento"
                            fullWidth
                            label="DNI"
                            inputProps={{maxlength: 8}}>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} xl={6}>
                            <TextField
                            onChange={onInputChange}
                            value={Cuit}
                            onKeyPress={(e) => {
                                if (!/^[,0-9]+$/.test(e.key)) {
                                    e.preventDefault();
                                }}}
                            variant="outlined"
                            name="Cuit"
                            fullWidth
                            label="CUIT"
                            inputProps={{maxlength: 11}}>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} xl={6}>
                            <TextField
                            variant="outlined"
                            value={CondicionIvaId}
                            onChange={handleChangeCondicionIVASeleccionado}
                            fullWidth
                            select
                            label="Condición IVA"
                            >
                            {condicionesIva.map((condicionIva)=>(
                                <MenuItem key={condicionIva.CondicionIvaId} value={condicionIva.CondicionIvaId}>{condicionIva.CondicionIvaNombre}</MenuItem>
                            ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} xl={6}>
                            <TextField
                            variant="outlined"
                            value={Email}
                            name="Email"
                            onChange={onInputChange}
                            fullWidth
                            label="Email"
                            >
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} xl={6}>
                            <DatePicker 
                            inputVariant="outlined"
                            value={FechaNacimiento}
                            onChange={(fecha)=>setFechaNacimiento(fecha)}
                            disableFuture
                            format="dd/MM/yyyy"
                            fullWidth
                            label="Fecha de nacimiento"
                            openTo="year"
                            views={["year", "month", "date"]}>
                            </DatePicker >
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} xl={6}>
                            <TextField
                            variant="outlined"
                            value={Telefono}
                            name="Telefono"
                            onChange={onInputChange}
                            onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                            }}}
                            fullWidth
                            label="N° Teléfono">
                            </TextField>
                        </Grid>
                    </Grid>
            </CardContent>
        </Card>
        <br/>
        <div style={{textAlign: 'center', marginBottom: '1.5rem'}}>
            <Button type="submit" startIcon={<i className={location.state ? "bx bx-edit":"bx bx-check"}></i>}
            variant="contained" color="primary">
            {location.state ? "Modificar" : "Registrar"}
            </Button>
        </div>
    </TabPanel>
    <TabPanel>
        <Card>
            <CardContent>
                <Typography variant="h1">{location.state ? `Editar abonado: ${location.state.Apellido},  ${location.state.Nombre}` : "Agregar abonado"}</Typography>
                <br/>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4} lg={4} xl={4}>
                        <TextField
                        variant = {location.state ? "filled" : "outlined"}
                        disabled = {location.state ? true : false}
                        value={location.state ? location.state.ProvinciaNombre : ProvinciaId}
                        label="Provincia"
                        fullWidth
                        select = {location.state ? false : true}
                        >
                        {!location.state ? provincias.map((provincia)=>(
                            <MenuItem key={provincia.ProvinciaId} value={provincia.ProvinciaId}>{provincia.ProvinciaNombre}</MenuItem>
                        )): ""}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={4} lg={4} xl={4}>
                        <TextField
                        variant = {location.state ? "filled" : "outlined"}
                        disabled = {location.state ? true : false}
                        onChange={handleChangeMunicipioSeleccionado}
                        value={location.state ? location.state.MunicipioNombre : Municipio}
                        label="Municipio"
                        fullWidth
                        select = {location.state ? false : true}
                        >
                        {!location.state ? municipios.length > 0 ? municipios.map((municipio)=>(
                            <MenuItem key={municipio.MunicipioId} value={municipio}>{municipio.MunicipioNombre}</MenuItem>
                        )): <MenuItem disabled>No se encontraron municipios</MenuItem> : ""}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={4} lg={4} xl={4}>
                    {location.state ? 
                    <TextField
                        variant = "filled"
                        disabled
                        value={location.state.BarrioNombre}
                        fullWidth
                        label="Barrio">
                    </TextField>
                    :
                    <Autocomplete
                    disableClearable
                    disabled={location.state ? true : false}
                    value={location.state ? location.state.BarrioNombre : Barrio}
                    onChange={(_event, newBarrioId) => {
                        setBarrio(newBarrioId);
                    }}
                    options={barrios}
                    noOptionsText="No se encontraron barrios"
                    getOptionLabel={(option) => option.BarrioNombre}
                    renderInput={(params) => <TextField {...params} variant = {location.state ? "filled" : "outlined"} fullWidth label="Barrios"/>}
                    />
                    }
                    </Grid>
                    <Grid item xs={12} md={4} lg={4} xl={4}>
                        <TextField
                        variant = {location.state ? "filled" : "outlined"}
                        disabled = {location.state ? true : false}
                        value={DomicilioCalle}
                        name="DomicilioCalle"
                        onChange={onInputChange}
                        fullWidth
                        label="Calle">
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={4} lg={4} xl={4}>
                        <TextField
                        variant = {location.state ? "filled" : "outlined"}
                        disabled = {location.state ? true : false}
                        value={DomicilioNumero}
                        name="DomicilioNumero"
                        onChange={onInputChange}
                        onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                        }}}
                        fullWidth
                        label="Número">
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={4} lg={4} xl={4}>
                        <TextField
                        variant = {location.state ? "filled" : "outlined"}
                        disabled = {location.state ? true : false}
                        value={DomicilioPiso}
                        name="DomicilioPiso"
                        onChange={onInputChange}
                        onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                        }}}
                        fullWidth
                        label="Piso">
                        </TextField>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    </TabPanel>
    <TabPanel>
        <Card>
            <CardContent>
            <Typography variant="h1">{location.state ? `Editar abonado: ${location.state.Apellido},  ${location.state.Nombre}` : "Agregar abonado"}</Typography>
            <br/>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={6} xl={6}>
                        <TextField
                        variant = {location.state ? "filled" : "outlined"}
                        disabled = {location.state ? true : false}
                        value={location.state ? location.state.ServicioNombre : Servicio}
                        onChange={handleChangeServicioSeleccionado}
                        label="Tipo de servicio"
                        fullWidth
                        select = {location.state ? false : true}
                        >
                        {servicios.map((servicio)=>(
                            <MenuItem key={servicio.ServicioId} value={servicio}>{servicio.ServicioNombre} | Precio: ${servicio.ServicioPrecioUnitario} + Inscripción: ${servicio.ServicioInscripcion}</MenuItem>
                        ))}
                        </TextField>
                        { Servicio.ServicioId === 2 || Servicio.ServicioId === 3 ?
                        <>
                        <FormControlLabel label="Paga en dos cuotas"
                        control={<Checkbox
                        onChange={e => {
                            setDosCuotas(e.target.checked);
                            if(!DosCuotas) {
                                setMovimientoCantidad(MovimientoCantidad * 0.5);
                            }
                            else {
                                setMovimientoCantidad(Servicio.ServicioPrecioUnitario + Servicio.ServicioInscripcion);
                            }
                        }
                        }
                        checked={DosCuotas}>
                        </Checkbox>}>
                        </FormControlLabel>
                        </>
                        :""}
                    </Grid>
                    <Grid item xs={12} md={6} lg={6} xl={6}>
                    <TextField
                        variant = {location.state ? "filled" : "outlined"}
                        disabled = {location.state ? true : false}
                        value={location.state ? location.state.MedioPagoId : MedioPagoId}
                        onChange={handleChangeMedioPagoSeleccionado}
                        label="Medio de Pago"
                        fullWidth
                        select
                        >
                        {!location.state ? mediosPago.map((mp)=>(
                            <MenuItem key={mp.mpId} value={mp.MedioPagoNombre}>{mp.MedioPagoNombre}</MenuItem>
                        )): ""}
                    </TextField>
                    </Grid>
                    <Grid item xs={6} md={4} lg={4} xl={4}>
                        <DatePicker 
                        disabled = {location.state ? true : false}
                        inputVariant={location.state ? "filled" : "outlined"}
                        value={FechaContrato}
                        onChange={(fecha)=>setFechaContrato(fecha)}
                        format="dd/MM/yyyy"
                        fullWidth
                        label="Fecha de Contrato"
                        >
                        </DatePicker >
                    </Grid>
                    <Grid item xs={6} md={4} lg={4} xl={4}>
                        <DatePicker 
                        disabled = {location.state ? true : false}
                        inputVariant={location.state ? "filled" : "outlined"}
                        value={FechaBajada}
                        onChange={(fecha)=>setFechaBajada(fecha)}
                        format="dd/MM/yyyy"
                        fullWidth
                        label="Fecha de Bajada"
                        >
                        </DatePicker >
                    </Grid>
                    {Servicio.ServicioId !== 1 ?
                <>
                    <Grid item xs={12} md={4} lg={4} xl={4}>
                        <Autocomplete
                        disabled={location.state ? true : false}
                        value={location.state ? location.state.OnuId : Onu}
                        onChange={(_event, newOnu) => {
                            setOnu(newOnu);
                        }}
                        options={onus}
                        getOptionLabel={(option) => option.OnuMac + " - " + option.ModeloOnuNombre}
                        renderInput={(params) => <TextField {...params} variant="outlined" fullWidth label="Onus disponibles"/>}
                        />
                    </Grid>
                </> : ""}
                </Grid>
            <br/>
            {location.state ? <Alert severity="info">Para modificar todos los datos del domicilio y del servicio contratado se tiene que realizar desde las opciones <b>Cambio de Domicilio y Cambio de Servicio</b> respectivamente.</Alert> :""}
            </CardContent>
        </Card>
    </TabPanel>
    </Tabs>
    </form>
    </main>
    <Footer/>
    </div>
    </>
    );
}
 
export default CaratulaAbonado;