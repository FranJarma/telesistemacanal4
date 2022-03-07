import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../../../context/appContext';
import Aside from '../design/layout/Aside';
import Footer from '../design/layout/Footer';
import Modal from '../design/components/Modal';
import { Button, Card, CardContent, CardHeader, FormHelperText, Grid, MenuItem, TextField, Typography } from '@material-ui/core'; 
import { useLocation } from 'react-router-dom';
import Datatable from '../design/components/Datatable';
import { Autocomplete } from '@material-ui/lab';
import { DatePicker, TimePicker } from '@material-ui/pickers';
import convertirAFecha from '../../../helpers/ConvertirAFecha';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import TooltipForTable from '../../../helpers/TooltipForTable';

const CambioDomicilio = () => {
    const appContext = useContext(AppContext);
    const { tareas, barrios, historialDomicilios, municipios, provincias, usuarios, ordenesDeTrabajoAsignadas, traerBarriosPorMunicipio, traerDomiciliosAbonado, traerMunicipiosPorProvincia, traerOrdenesDeTrabajoAsignadas,
    traerProvincias, cambioDomicilioAbonado, traerTareas, traerUsuariosPorRol } = appContext;
    const location = useLocation();
    //Observables
    useEffect(() => {
        traerTareas();
        traerProvincias();
        traerMunicipiosPorProvincia(ProvinciaId);
        traerDomiciliosAbonado(location.state.UserId);
        traerUsuariosPorRol(process.env.ID_ROL_TECNICO);
    }, [])
    //States
    const [DomicilioInfo, setDomicilioInfo] = useState({
        UserId: location.state.UserId,
        ServicioId: location.state.ServicioId,
        DomicilioCalle: null,
        DomicilioNumero: null,
        DomicilioPiso: null,
        CambioDomicilioObservaciones: null,
        createdBy: sessionStorage.getItem('identity')
    })
    const onInputChange = (e) => {
        setDomicilioInfo({
            ...DomicilioInfo,
            [e.target.name] : e.target.value
        });
    }
    const { UserId, ServicioId, DomicilioCalle, DomicilioNumero, DomicilioPiso, createdBy, CambioDomicilioObservaciones} = DomicilioInfo;
    //seteamos en 10 para que traiga jujuy directamente
    const [ProvinciaId, setProvinciaId] = useState(10);
    //para más adelante cuando vayan a otras provincias
    /*
    const handleChangeProvinciaSeleccionada = (e) => {
        setProvinciaId(e.target.value);
        setMunicipioId(0);
        setBarrioId(0);
        traerMunicipiosPorProvincia(e.target.value);
    }*/
    const [Barrio, setBarrio] = useState(null);
    const [MunicipioId, setMunicipioId] = useState(0);
    const [ModalNuevoDomicilio, setModalNuevoDomicilio] = useState(false);

    const handleChangeMunicipioSeleccionado = (e) => {
        setMunicipioId(e.target.value);
        setBarrio(null);
        traerBarriosPorMunicipio(e.target.value);
    }

    const handleChangeModalNuevoDomicilio = () => {
        setModalNuevoDomicilio(!ModalNuevoDomicilio);
        setDomicilioInfo({
            ...DomicilioInfo,
            UserId: location.state.UserId
        })
    }

    const [OtFechaPrevistaVisita, setOtFechaPrevistaVisita] = useState(null);
    const [Tecnico, setTecnico] = useState(null);
    const [OtObservacionesResponsableEmision, setOtObservacionesResponsableEmision] = useState(null);

    const onInputChangeObservacionesOt = (e) => {
        setOtObservacionesResponsableEmision(e.target.value);
    }

    const onSubmitAbonado = (e) => {
        e.preventDefault();
        if(location.state) {
            cambioDomicilioAbonado({
                UserId,
                ServicioId,
                //ProvinciaId
                Barrio,
                MunicipioId,
                DomicilioCalle,
                DomicilioNumero,
                DomicilioPiso,
                CambioDomicilioObservaciones,
                createdBy,
                OtFechaPrevistaVisita,
                Tecnico,
                OtObservacionesResponsableEmision
            }, setModalNuevoDomicilio)
    }
}
    const columnasDomicilios = [
        {
            "name": "id",
            "selector": row =>row["UserId"],
            "omit": true,
        },
        {
            "name": "Dirección",
            "selector": row => row["DomicilioCalle"] + ', ' + row["DomicilioNumero"],
            "wrap": true,
            "sortable": true
        },
        {
            "name": "Barrio",
            "selector": row =>row["BarrioNombre"],
            "hide": "sm",
            "wrap": true,
            "sortable": true
        },
        {
            "name": "Municipio",
            "selector": row =>row["MunicipioNombre"],
            "wrap": true,
            "sortable": true
        },
        {
            "name": "Fecha de Cambio",
            "selector": row =>convertirAFecha(row["createdAt"]),
            "hide": "sm",
            "wrap": true
        },
        {
            "name": "Observaciones",
            "selector": row =>row["CambioDomicilioObservaciones"],
            "hide": "sm",
            "wrap": true
        },
    ]
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
    const ExpandedComponent = ({ data }) =>
    <>
        <Typography style={{fontWeight: 'bold'}} variant="h6"><i className="bx bx-home"></i> Dirección: {data.DomicilioCalle} {data.DomicilioNumero}</Typography>
        <Typography style={{fontWeight: 'bold'}} variant="h6"><i className="bx bxs-home"></i> Barrio: {data.BarrioNombre}</Typography>
        <Typography style={{fontWeight: 'bold'}} variant="h6"><i className="bx bx-building-house"></i> Municipio: {data.MunicipioNombre}</Typography>
        <Typography style={{fontWeight: 'bold'}} variant="h6"><i className="bx bx-calendar"></i> Fecha de Cambio: {data.createdAt.split('T')[0].split('-').reverse().join('/')}</Typography>
        <Typography style={{fontWeight: 'bold'}} variant="h6"><i className="bx bx-clipboard"></i> Observaciones: {data.CambioDomicilioObservaciones}</Typography>
    </>;
    return ( 
    <>
    <div className="container">
    <Aside/>
    <main>
    <Card>
        <CardHeader
            action={<Button onClick={setModalNuevoDomicilio} startIcon={<i className="bx bx-plus"></i>} variant="contained" color="primary">Nuevo Domicilio</Button>}>
        </CardHeader>
        <CardContent>
            <Typography variant="h1">Historial de cambios de domicilio del abonado: {location.state.Apellido}, {location.state.Nombre}</Typography>
            <br/>
            <Datatable
            loader={true}
            expandedComponent={ExpandedComponent}
            datos={historialDomicilios}
            columnas={columnasDomicilios}
            paginacion={true}
            buscar={true}/>
            <FormHelperText>Los domicilios están ordenados por fecha más reciente</FormHelperText>
            <br/>
        </CardContent>
        <Modal
        abrirModal={ModalNuevoDomicilio}
        funcionCerrar={handleChangeModalNuevoDomicilio}
        botones={
        <>
        <Button
            variant="contained"
            color="primary"
            onClick={onSubmitAbonado}>
            Agregar</Button>
        <Button onClick={handleChangeModalNuevoDomicilio}>Cerrar</Button></>}
        formulario={
            <>
            <Tabs>
            <TabList>
                <Tab><i style={{color: "teal"}} className="bx bxs-home"></i> Datos del nuevo domicilio</Tab>
                <Tab><i style={{color: "teal"}} className="bx bx-task"></i> Datos de la OT</Tab>
            </TabList>
            <TabPanel>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4} lg={4} xl={4}>
                    <TextField
                    variant="filled"
                    disabled
                    //onChange={handleChangeProvinciaSeleccionada}
                    value={ProvinciaId}
                    label="Provincia"
                    fullWidth
                    select
                    >
                    {provincias.map((provincia)=>(
                        <MenuItem key={provincia.ProvinciaId} value={provincia.ProvinciaId}>{provincia.ProvinciaNombre}</MenuItem>
                    ))}
                    </TextField>
                </Grid>
                <Grid item xs={12} md={4} lg={4} xl={4}>
                    <TextField
                    variant = "outlined"
                    onChange={handleChangeMunicipioSeleccionado}
                    value={MunicipioId}
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
                    <Autocomplete
                    value={Barrio}
                    onChange={(_event, nuevoBarrio) => {
                        setBarrio(nuevoBarrio);
                    }}
                    options={barrios}
                    noOptionsText="No se encontraron barrios"
                    getOptionLabel={(option) => option.BarrioNombre}
                    renderInput={(params) => <TextField {...params} variant = "outlined" fullWidth label="Barrios"/>}
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={6} xl={6}>
                    <TextField
                    variant = "outlined"
                    value={DomicilioCalle}
                    name="DomicilioCalle"
                    onChange={onInputChange}
                    fullWidth
                    label="Calle">
                    </TextField>
                </Grid>
                <Grid item xs={12} md={3} lg={3} xl={3}>
                    <TextField
                    onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                    }}}
                    variant = "outlined"
                    value={DomicilioNumero}
                    name="DomicilioNumero"
                    onChange={onInputChange}
                    fullWidth
                    label="Número">
                    </TextField>
                </Grid>
                <Grid item xs={12} md={3} lg={3} xl={3}>
                    <TextField
                    onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                    }}}
                    variant = "outlined"
                    value={DomicilioPiso}
                    name="DomicilioPiso"
                    onChange={onInputChange}
                    fullWidth
                    label="Piso">
                    </TextField>
                </Grid>
            </Grid>
            </TabPanel>
            <TabPanel>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={6} xl={6}>
                        <DatePicker
                        inputVariant="outlined"
                        value={OtFechaPrevistaVisita}
                        onChange={(OtFechaPrevistaVisita)=> {
                            setOtFechaPrevistaVisita(OtFechaPrevistaVisita)
                        }}
                        format="dd/MM/yyyy"
                        placeholder='dia/mes/año'
                        fullWidth
                        label="Fecha prevista de visita"
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
                    { Tecnico !== null?
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
                            <TextField
                            disabled
                            variant="filled"
                            value={sessionStorage.getItem('usr')}
                            fullWidth
                            label="Responsable de emisión de OT">
                            </TextField>
                        </Grid>
                        <Grid item xs={6} md={4} lg={4} xl={4}>
                            <DatePicker
                                disabled
                                value={new Date()}
                                format="dd/MM/yyyy"
                                inputVariant="filled"
                                fullWidth
                                label="Fecha de emisión de OT"
                            ></DatePicker>
                        </Grid>
                        <Grid item xs={6} md={4} lg={4} xl={4}>
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
                {location.state.ServicioId === 1 ? tareas.filter((tarea) => tarea.TareaId === 14).map((tarea) => <Typography variant="h2">Total por {tarea.TareaNombre}: $ {tarea.TareaPrecioUnitario}</Typography>)
                : tareas.filter((tarea) => tarea.TareaId === 15).map((tarea) => <Typography variant="h2">Total por {tarea.TareaNombre}: $ {tarea.TareaPrecioUnitario}</Typography>)}
                </TabPanel>
                </Tabs>
            </>
        }></Modal>
        </Card>
    </main>
    <Footer/>
    </div>
    </>
    );
}
 
export default CambioDomicilio;