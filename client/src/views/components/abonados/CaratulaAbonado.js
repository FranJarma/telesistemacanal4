import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../../../context/appContext';
import Aside from '../design/layout/Aside';
import Footer from '../design/layout/Footer';
import { Button, Card, CardContent, Chip, Grid, MenuItem, TextField, Typography } from '@material-ui/core'; 
import { DatePicker, TimePicker } from '@material-ui/pickers';
import { useLocation } from 'react-router-dom';
import { Alert } from '@material-ui/lab';
import { Autocomplete } from '@material-ui/lab';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Datatable from '../design/components/Datatable';
import convertirAFecha from '../../../helpers/ConvertirAFecha';
import TooltipForTable from '../../../helpers/TooltipForTable';

const CaratulaAbonado = () => {
    const appContext = useContext(AppContext);
    const { barrios, condicionesIva, municipios, servicios, provincias, usuarios, mediosPago, ordenesDeTrabajoAsignadas, traerBarriosPorMunicipio, traerCondicionesIva, traerMunicipiosPorProvincia, traerServicios,
    traerProvincias, crearAbonado, modificarAbonado, traerMediosPago, traerOrdenesDeTrabajoAsignadas, traerUsuariosPorRol } = appContext;
    
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
        MunicipioId: null,
        MunicipioNombre: null
    });
    const [Barrio, setBarrio] = useState(null);
    const [Servicio, setServicio] = useState(null);
    const [CondicionIvaId, setCondicionIvaId] = useState(null);
    const [MedioPago, setMedioPago] = useState(null);
    const [FechaNacimiento, setFechaNacimiento] = useState(new Date());
    const [FechaContrato, setFechaContrato] = useState(new Date());
    const [PagoInfo, setPagoInfo] = useState({
        Interes: null,
        Total: null,
        Inscripcion: null,
        Saldo: null
    });
    const [OtFechaPrevistaVisita, setOtFechaPrevistaVisita] = useState(null);
    const [Tecnico, setTecnico] = useState(null);
    const [OtObservacionesResponsableEmision, setOtObservacionesResponsableEmision] = useState(null);

    const onInputChangeObservacionesOt = (e) => {
        setOtObservacionesResponsableEmision(e.target.value);
    }

    const handleChangeMunicipioSeleccionado = (e) => {
        setMunicipio(e.target.value);
        setBarrio(null);
        traerBarriosPorMunicipio(e.target.value);
    }

    const handleChangeServicioSeleccionado = (e) => {
        setServicio(e.target.value);
        setMedioPago(null);   
    }
    const handleChangeCondicionIVASeleccionado = (e) => {
        setCondicionIvaId(e.target.value);
    }
    const handleChangeMedioPagoSeleccionado = (e) => {
        setMedioPago(e.target.value);
        setPagoInfo({
            ...PagoInfo,
            Interes: e.target.value.MedioPagoInteres / 100,
            Total: (Servicio.ServicioInscripcion + (Servicio.ServicioInscripcion*e.target.value.MedioPagoInteres / 100)).toFixed(2),
            Inscripcion: ((Servicio.ServicioInscripcion + (Servicio.ServicioInscripcion*e.target.value.MedioPagoInteres / 100))/e.target.value.MedioPagoCantidadCuotas).toFixed(2),
            Saldo: ((Servicio.ServicioInscripcion + (Servicio.ServicioInscripcion*e.target.value.MedioPagoInteres / 100)) - ((Servicio.ServicioInscripcion + (Servicio.ServicioInscripcion*e.target.value.MedioPagoInteres / 100))/e.target.value.MedioPagoCantidadCuotas)).toFixed(2)
        })
    }

    useEffect(() => {
        traerProvincias();
        traerMunicipiosPorProvincia(ProvinciaId);
        //traerBarriosPorMunicipio(Municipio);
        traerMediosPago();
        traerServicios();
        traerCondicionesIva();
        traerUsuariosPorRol(process.env.ID_ROL_TECNICO);
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
                updatedAt: new Date(),
                updatedBy: sessionStorage.getItem('identity')
            });
            setMunicipio(location.state.MunicipioId);
            setServicio({
                ServicioId: location.state.ServicioId,
                ServicioNombre: location.state.ServicioNombre,
                ServicioPrecioUnitario: location.state.ServicioPrecioUnitario,
                ServicioInscripcion: location.state.ServicioInscripcion,
            });
            setCondicionIvaId(location.state.CondicionIvaId);
            setFechaNacimiento(location.state.FechaNacimiento);
            setOtFechaPrevistaVisita(location.state.OtFechaPrevistaVisita);
            setFechaContrato(location.state.FechaContrato);
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
                OtFechaPrevistaVisita,
                CondicionIvaId,
                ProvinciaId,
                Municipio,
                Barrio,
                Servicio,
                createdBy,
                PagoInfo,
                MedioPago,
                Tecnico,
                OtObservacionesResponsableEmision
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
                OtFechaPrevistaVisita,
                CondicionIvaId,
                Servicio,
                updatedAt,
                updatedBy
            });
        }
    }
    const columnasOt = [
        {
            "name": "id",
            "selector": row => row["OtId"],
            "omit": true
        },
        {
            "name": <TooltipForTable name="Fecha prevista de visita" />,
            "wrap": true,
            "sortable": true,
            "selector": row => convertirAFecha(row["OtFechaPrevistaVisita"]),
        }  ,  
        {
            "name": "Domicilio",
            "wrap": true,
            "sortable": true,
            "selector": row => row["DomicilioCalle"] + ', ' + row["DomicilioNumero"] + ' | ' +  "Barrio " + row["BarrioNombre"] + ' | ' +  row["MunicipioNombre"],
        }    
    ]
    return ( 
    <>
    <div className="container">
    <Aside/>
    <main>
    <form onSubmit={onSubmitAbonado}>
    <Tabs>
        <TabList>
            <Tab><i style={{color: 'teal'}} className="bx bxs-user"></i> Abonado</Tab>
            <Tab><i style={{color: 'teal'}} className='bx bxs-home'></i> Domicilio</Tab>
            <Tab><i style={{color: 'teal'}} className='bx bx-money'></i> Servicio</Tab>
            <Tab><i style={{color: 'teal'}} className='bx bxs-plug'></i> Instalación y OT</Tab>
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
                            variant="filled"
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
                        onChange={handleChangeMunicipioSeleccionado}
                        value={Municipio}
                        label="Municipio"
                        fullWidth
                        select
                        >
                        {municipios.length > 0 ? municipios.map((municipio)=>(
                            <MenuItem key={municipio.MunicipioId} value={municipio.MunicipioId}>{municipio.MunicipioNombre}</MenuItem>
                        )): <MenuItem disabled>No se encontraron municipios</MenuItem>}
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
            <br/>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={12} lg={12} xl={12}>
                        <TextField
                        variant = {location.state ? "filled" : "outlined"}
                        disabled = {location.state ? true : false}
                        value={location.state ? location.state.ServicioNombre : Servicio !== null ? Servicio : ""}
                        onChange={handleChangeServicioSeleccionado}
                        label="Tipo de servicio"
                        fullWidth
                        select = {location.state ? false : true}
                        >
                        {servicios.map((servicio)=>(
                            <MenuItem key={servicio.ServicioId} value={servicio}>{servicio.ServicioNombre} - Inscripción: ${servicio.ServicioInscripcion}</MenuItem>
                        ))}
                        </TextField>
                    </Grid>
                    {Servicio !== null && !location.state
                    ?
                    <>
                    <Grid item xs={12} md={6} lg={6} xl={6}>
                    <TextField
                        variant = "outlined"
                        value={MedioPago}
                        onChange={handleChangeMedioPagoSeleccionado}
                        label="Medio de Pago de Inscripción"
                        fullWidth
                        select
                        >
                        {!location.state ? mediosPago.map((mp)=>(
                            <MenuItem key={mp.MedioPagoId} value={mp}>{mp.MedioPagoNombre}</MenuItem>
                        )): ""}
                    </TextField>
                    </Grid>
                    </>
                    : "" }
                    { Servicio !== null && MedioPago !== null && !location.state
                    ?
                    <>
                    <Grid item xs={12} md={6} lg={6} xl={6}>
                    <TextField
                        variant="outlined"
                        value={PagoInfo.Interes * Servicio.ServicioInscripcion}
                        label={"Interés del total: (" + MedioPago.MedioPagoInteres +"%)"}
                        fullWidth
                        >
                    </TextField>
                    </Grid>
                    </>
                    :""}
                </Grid>
                <br/>
                {Servicio !== null && MedioPago !== null ?
                <>
                <Typography variant="h1">Precios finales</Typography>
                <br/>
                <Grid item xs={12} md={12} sm={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h2"><b>Total (Precio Inscripción + {MedioPago.MedioPagoInteres} %):</b> ${PagoInfo.Total}</Typography>
                            <Typography variant="h2"><b>Cantidad de cuotas: </b>{MedioPago.MedioPagoCantidadCuotas}</Typography>
                            <Typography variant="h2"><b>Valor de cada cuota: </b> ${PagoInfo.Inscripcion} <i className='bx bx-left-arrow-alt'></i> <Chip variant="outlined" color="secondary" label="Entra en caja hoy"></Chip></Typography>
                            <Typography variant="h2"><b>Saldo restante:</b> ${PagoInfo.Saldo}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                </>
                : "" }
            <br/>
            {location.state ? <Alert severity="info">Para modificar todos los datos del domicilio y del servicio contratado se tiene que realizar desde las opciones <b>Cambio de Domicilio y Cambio de Servicio</b> respectivamente.</Alert> :""}
            </CardContent>
        </Card>
    </TabPanel>
    <TabPanel>
        <Card>
            <CardContent>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={6} xl={6}>
                        <DatePicker
                        disabled
                        inputVariant="filled"
                        value={FechaContrato}
                        format="dd/MM/yyyy"
                        fullWidth
                        label="Fecha de Contrato"
                        >
                        </DatePicker>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6} xl={6}>
                        <Autocomplete
                        value={Tecnico}
                        onChange={(_event, newTecnico) => {
                            traerOrdenesDeTrabajoAsignadas(newTecnico.UserId, 5);
                            setTecnico(newTecnico);
                        }}
                        options={usuarios}
                        noOptionsText="No se encontraron técnicos"
                        getOptionLabel={(option) => option.Nombre +", "+ option.Apellido}
                        renderInput={(params) => <TextField {...params} variant ="outlined" fullWidth label="Técnico encargado de ejecución"/>}
                        />
                    </Grid>
                    { Tecnico !== null ?
                    <Grid item xs={12} md={12} lg={12} xl={12}>
                        <Typography variant="h6">Órdenes de trabajo pendientes y asignadas a: {Tecnico.Nombre}, {Tecnico.Apellido}</Typography>
                        <br/>
                        <Card>
                            <CardContent>
                            <Datatable
                                datos={ordenesDeTrabajoAsignadas}
                                columnas={columnasOt}>
                                </Datatable>
                            </CardContent>
                        </Card>

                    </Grid>
                    : ""}
                    <Grid item xs={12} md={4} lg={4} xl={4}>
                        <DatePicker 
                        disabled = {location.state ? true : false}
                        inputVariant={location.state ? "filled" : "outlined"}
                        value={OtFechaPrevistaVisita}
                        onChange={(OtFechaPrevistaVisita)=> {
                            setOtFechaPrevistaVisita(OtFechaPrevistaVisita)
                        }}
                        format="dd/MM/yyyy"
                        placeholder='dia/mes/año'
                        fullWidth
                        label="Fecha prevista de visita"
                        >
                        </DatePicker >
                    </Grid>
                    <Grid item xs={12} md={3} lg={3} xl={3}>
                            <TextField
                            disabled
                            variant="filled"
                            value={sessionStorage.getItem('usr')}
                            fullWidth
                            label="Responsable de emisión de OT">
                            </TextField>
                        </Grid>
                        <Grid item xs={6} md={3} lg={3} xl={3}>
                            <DatePicker
                                disabled
                                value={new Date()}
                                format="dd/MM/yyyy"
                                inputVariant="filled"
                                fullWidth
                                label="Fecha de emisión de OT"
                            ></DatePicker>
                        </Grid>
                        <Grid item xs={6} md={2} lg={2} xl={2}>
                            <TimePicker
                                value={new Date()}
                                disabled
                                inputVariant="filled"
                                fullWidth
                                label="Hora de emisión de OT"
                            ></TimePicker>
                        </Grid>
                        <Grid item xs={12} md={12} lg={12} xl={12}>
                            <TextField
                            variant = "outlined"
                            multiline
                            minRows={3}
                            value={OtObservacionesResponsableEmision}
                            name="OtObservacionesResponsableEmision"
                            inputProps={{
                                maxLength: 1000
                            }}
                            onChange={onInputChangeObservacionesOt}
                            fullWidth
                            label="Observaciones registro de OT">
                            </TextField>
                        </Grid>
                </Grid>
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