import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../../../context/appContext';
import Aside from '../design/layout/Aside';
import Footer from '../design/layout/Footer';
import { Button, Card, CardContent, Grid, MenuItem, TextField, Typography } from '@material-ui/core'; 
import { DatePicker } from '@material-ui/pickers';
import { useLocation } from 'react-router-dom';
import { Alert } from '@material-ui/lab';
import { Autocomplete } from '@material-ui/lab';

const CaratulaAbonado = () => {
    const appContext = useContext(AppContext);
    const { usuarioLogueado, barrios, condicionesIva, municipios, servicios, provincias, onus, onu, traerBarriosPorMunicipio, traerCondicionesIva, traerMunicipiosPorProvincia, traerServicios,
    traerProvincias, traerONUS, traerONUPorId, crearAbonado, modificarAbonado } = appContext;
    
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
        createdBy: usuarioLogueado.User.UserId,
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
        setMunicipioId(0);
        setBarrio(0);
        traerMunicipiosPorProvincia(e.target.value);
    }*/
    const [MunicipioId, setMunicipioId] = useState(0);
    const [Barrio, setBarrio] = useState(null);
    const [ServicioId, setServicioId] = useState(0);
    const [CondicionIvaId, setCondicionIvaId] = useState(0);
    const [OnuId, setOnuId] = useState(0);
    const [FechaNacimiento, setFechaNacimiento] = useState(new Date());
    const [FechaContrato, setFechaContrato] = useState(new Date());
    const [FechaBajada, setFechaBajada] = useState(new Date());

    const handleChangeMunicipioSeleccionado = (e) => {
        setMunicipioId(e.target.value);
        setBarrio(null);
        traerBarriosPorMunicipio(e.target.value);
    }
    const handleChangeBarrioSeleccionado = (e) => {
        setBarrio(e.target.value);
    }
    const handleChangeServicioSeleccionado = (e) => {
        setServicioId(e.target.value);
    }
    const handleChangeCondicionIVASeleccionado = (e) => {
        setCondicionIvaId(e.target.value);
    }

    useEffect(() => {
        traerProvincias();
        traerMunicipiosPorProvincia(ProvinciaId);
        //traerBarriosPorMunicipio(MunicipioId);
        setServicioId(1);
        traerServicios();
        traerCondicionesIva();
        traerONUS(5); //hay que traer ONUS no asignadas a ningún abonado
    }, [])
    
    useEffect(() => {
        if(location.state)
        {
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
                updatedAt: new Date().toString(),
                updatedBy: usuarioLogueado.User.UserId
            });
            setServicioId(location.state.ServicioId);
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
                MunicipioId,
                Barrio,
                ServicioId,
                OnuId,
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
                ServicioId,
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
    <Card>
        <CardContent>
            <Typography variant="h1">{location.state ? `Editar abonado: ${location.state.Apellido},  ${location.state.Nombre}` : "Agregar abonado"}</Typography>
            <Typography variant="h2"><i className="bx bx-user"></i> Datos del abonado</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4} lg={4} xl={4}>
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
                <Grid item xs={12} md={4} lg={4} xl={4}>
                    <TextField
                    variant="outlined"
                    value={Apellido}
                    name="Apellido"
                    onChange={onInputChange}
                    fullWidth
                    label="Apellido">
                    </TextField>
                </Grid>
                <Grid item xs={12} md={4} lg={4} xl={4}>
                    <TextField
                    variant="outlined"
                    value={Documento}
                    name="Documento"
                    onChange={onInputChange}
                    fullWidth
                    label="DNI"
                    type="number">
                    </TextField>
                </Grid>
                <Grid item xs={12} md={6} lg={6} xl={6}>
                    <TextField
                    variant="outlined"
                    value={Cuit}
                    name="Cuit"
                    onChange={onInputChange}
                    fullWidth
                    label="CUIT"
                    type="number"
                    >
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
                <Grid item xs={12} md={4} lg={4} xl={4}>
                    <TextField
                    variant="outlined"
                    value={Telefono}
                    name="Telefono"
                    onChange={onInputChange}
                    type="number"
                    fullWidth
                    label="N° Teléfono">
                    </TextField>
                </Grid>
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
                    value={location.state ? location.state.MunicipioNombre : MunicipioId}
                    label="Municipio"
                    fullWidth
                    select = {location.state ? false : true}
                    >
                    {!location.state ? municipios.length > 0 ? municipios.map((municipio)=>(
                        <MenuItem key={municipio.MunicipioId} value={municipio.MunicipioId}>{municipio.MunicipioNombre}</MenuItem>
                    )): <MenuItem disabled>No se encontraron municipios</MenuItem> : ""}
                    </TextField>
                </Grid>
            </Grid>
            <Typography variant="h2"><i className="bx bx-home"></i> Datos del domicilio de instalación</Typography>
            <Grid container spacing={3}>
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
                <Grid item xs={12} md={2} lg={2}>
                    <TextField
                    variant = {location.state ? "filled" : "outlined"}
                    disabled = {location.state ? true : false}
                    value={DomicilioNumero}
                    name="DomicilioNumero"
                    onChange={onInputChange}
                    type="number"
                    fullWidth
                    label="Número">
                    </TextField>
                </Grid>
                <Grid item xs={12} md={2} lg={2}>
                    <TextField
                    variant = {location.state ? "filled" : "outlined"}
                    disabled = {location.state ? true : false}
                    value={DomicilioPiso}
                    name="DomicilioPiso"
                    onChange={onInputChange}
                    type="number"
                    fullWidth
                    label="Piso">
                    </TextField>
                </Grid>
            </Grid>
            <Typography  variant="h2"><i className="bx bx-plug"></i> Datos del servicio</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4} lg={4} xl={4}>
                    <TextField
                    variant = {location.state ? "filled" : "outlined"}
                    disabled = {location.state ? true : false}
                    value={location.state ? location.state.ServicioNombre : ServicioId}
                    onChange={handleChangeServicioSeleccionado}
                    label="Tipo de servicio"
                    fullWidth
                    select = {location.state ? false : true}
                    >
                    {!location.state ? servicios.map((servicio)=>(
                        <MenuItem key={servicio.ServicioId} value={servicio.ServicioId}>{servicio.ServicioNombre}</MenuItem>
                    )): ""}
                    </TextField>
                </Grid>
                <Grid item xs={12} md={4} lg={4} xl={4}>
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
                <Grid item xs={12} md={4} lg={4} xl={4}>
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
            </Grid>
            {ServicioId !== 1 ?
            <>
            <Typography variant="h2"><i className='bx bx-broadcast'></i> Datos de ONU</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={3} lg={3}>
                    <TextField
                    variant="outlined"
                    value={ServicioId}
                    label="Tipo de ONU"
                    fullWidth
                    select
                    disabled
                    >
                    {servicios.map((servicio)=>(
                        <MenuItem key={servicio.ServicioId} value={servicio.ServicioId}>{servicio.ServicioNombre}</MenuItem>
                    ))}
                    </TextField>
                </Grid>
                <Grid item xs={12} md={3} lg={3} xl={3}>
                <Autocomplete
                disabled={location.state ? true : false}
                value={location.state ? location.state.OnuMac : OnuId}
                onChange={(_event, newOnuId) => {
                    setOnuId(newOnuId);
                }}
                options={onus}
                getOptionLabel={(option) => option.OnuMac + " - " + option.ModeloOnuNombre}
                renderInput={(params) => <TextField {...params} variant="outlined" fullWidth label="Onus disponibles"/>}
                />
                </Grid>
            </Grid>
            </>
            : ""}
            <br/>
            {location.state ? <Alert severity="info">Para modificar todos los datos del domicilio y del servicio contratado se tiene que realizar desde las opciones <b>Cambio de Domicilio y Cambio de Servicio</b> respectivamente.</Alert> :""}
        </CardContent>
        <div style={{textAlign: 'center', marginBottom: '1.5rem'}}>
            <Button type="submit" startIcon={<i className={location.state ? "bx bx-edit":"bx bx-check"}></i>}
            variant="contained" color="primary">
            {location.state ? "Modificar" : "Registrar"}
        </Button>
        </div>
    </Card>
    </form>
    </main>
    <Footer/>
    </div>
    </>
    );
}
 
export default CaratulaAbonado;