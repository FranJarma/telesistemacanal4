import React, { useState, useContext, useEffect } from 'react';
import { Button, Card, CardContent, Checkbox, FormControl, FormControlLabel, Grid, LinearProgress, MenuItem, TextField, Typography } from '@material-ui/core';
import Aside from '../design/layout/Aside';
import Footer from '../design/layout/Footer';
import AppContext from '../../../context/appContext';
import { Alert, Autocomplete } from '@material-ui/lab';
import { useLocation } from 'react-router';
import { DatePicker } from '@material-ui/pickers';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import DataTable from 'react-data-table-component';
import * as VARIABLES from './../../../types/variables';
import Datatable from '../design/components/Datatable';
import TooltipForTable from '../../../helpers/TooltipForTable';
import convertirAFecha from '../../../helpers/ConvertirAFecha';
import GetFullName from './../../../helpers/GetFullName';
import GetUserId from './../../../helpers/GetUserId';

const CaratulaOt = () => {
    const appContext = useContext(AppContext);
    const { tareas, abonado, abonados, municipios, barrios, usuarios, traerBarriosPorMunicipio, traerMunicipios,
    traerTareas, traerAbonados, traerAbonado, traerUsuariosPorRol, traerTareasOt, traerTecnicosOt, tecnicosOrdenDeTrabajo, tareasOrdenDeTrabajo,
    crearOrdenDeTrabajo, modificarOrdenDeTrabajo, ordenesDeTrabajoAsignadas, traerOrdenesDeTrabajoAsignadas } = appContext;

    const location = useLocation();

    const [cargando, setCargando] = useState(false);
    const [tareasOt, setTareasOt] = useState([]);
    const [abonadoOt, setAbonadoOt] = useState(null);
    const [barrio, setBarrio] = useState(null);
    const [MunicipioId, setMunicipioId] = useState(0);
    const [OtRetiraOnu, setOtRetiraOnu]= useState(0);
    const [OtRetiraCable, setOtRetiraCable]= useState(0);
    const [OtInfo, setOtInfo] = useState({
        OtId: null,
        DomicilioCalle: "",
        DomicilioNumero: "",
        DomicilioPiso: null,
        OtObservacionesResponsableEmision: null,
        createdBy: null,
        updatedBy: null
    });
    const [OtResponsableEjecucion, setOtResponsableEjecucion] = useState(null);

    const [PrimerRender, setPrimerRender] = useState(true);
    const [TareasTab, setTareasTab] = useState(false);
    const [TecnicosTab, setTecnicosTab] = useState(false);

    const handleChangeTabTareas = (e) => {
        if(!TareasTab && location.state && PrimerRender) {
            setTareasOt(tareasOrdenDeTrabajo);
            setPrimerRender(false);
        }
        setTareasTab(!TareasTab);
    }

    const [OtFechaPrevistaVisita, setOtFechaPrevistaVisita] = useState(new Date());

    useEffect(()=>{
        traerTareas();
        traerMunicipios();
        traerAbonados(2); //TRAE ABONADOS ACTIVOS
        traerUsuariosPorRol(VARIABLES.ID_ROL_TECNICO);
    },[])

    useEffect(()=>{
        if(location.state){
            console.log(location.state);
            setOtInfo(location.state);
            setMunicipioId(location.state.MunicipioId);
            setBarrio(location.state);
            setOtRetiraCable(location.state.OtRetiraCable);
            setOtRetiraOnu(location.state.OtRetiraOnu);
            traerTareasOt(location.state.OtId);
            setTareasOt(tareasOrdenDeTrabajo);
            setOtResponsableEjecucion({
                Nombre: location.state.NombreResponsableEjecucion,
                Apellido: location.state.ApellidoResponsableEjecucion,
                UserId: location.state.OtResponsableEjecucion,
            });
            traerOrdenesDeTrabajoAsignadas(location.state.OtResponsableEjecucion, 5);
        }
    },[])

    const {OtId, DomicilioCalle, DomicilioNumero, DomicilioPiso, OtObservacionesResponsableEmision} = OtInfo;

    const onInputChange = (e) => {
        setOtInfo({
            ...OtInfo,
            [e.target.name] : e.target.value
        });
    }

    const handleChangeMunicipioSeleccionado = (e) => {
        setMunicipioId(e.target.value);
        setBarrio(null);
        traerBarriosPorMunicipio(e.target.value);
    }
    const handleChangeRetiraOnu = (e) => {
        e.target.checked ? setOtRetiraOnu(1) : setOtRetiraOnu(0);
    };
    const handleChangeRetiraCable = (e) => {
        e.target.checked ? setOtRetiraCable(1) : setOtRetiraCable(0);
    };

    const handleChangeTabOt = () => {
        if(abonado && location.state) {
            setAbonadoOt({
                abonado
            });
        }
    }

    const onSubmitOT = (e) => {
        e.preventDefault();
        if(!location.state) {
            crearOrdenDeTrabajo({
                DomicilioCalle, DomicilioNumero, DomicilioPiso,
                OtResponsableEjecucion,
                OtObservacionesResponsableEmision,
                OtFechaPrevistaVisita,
                OtRetiraCable,
                OtRetiraOnu,
                createdBy: GetUserId(),
                abonado,
                tareasOt,
                barrio
            });
        }
        else {
            modificarOrdenDeTrabajo({
                OtId, DomicilioCalle, DomicilioNumero, DomicilioPiso,
                OtObservacionesResponsableEmision,
                OtFechaPrevistaVisita,
                OtRetiraCable,
                OtRetiraOnu,
                updatedBy: GetUserId(),
                tareasOt
            });
        }
    }
    const columnasTareas = [
        {
            "name": "id",
            "selector": row => row["TareaId"],
            "omit": true
        },
        {
            "name": "Tipo de tarea",
            "selector": row => row["TareaNombre"],
        },
        {
            "name": "Precio de OT",
            "selector": row => "$ " + row["TareaPrecioOt"],
        }
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
            "selector": row => row["DomicilioCalle"] + ', ' + row["DomicilioNumero"] + ', B° ' + row["BarrioNombre"] + ' ' +  row["MunicipioNombre"],
        }    
    ]

    return ( 
        <>
        <div className="container">
        <Aside/>
        <main>
        <form onSubmit={onSubmitOT}>
        {location.state ? <Typography variant="h6">Editar Orden de Trabajo N°: {location.state.OtId}</Typography>
        :<Typography variant="h6">Crear Orden de Trabajo</Typography>}
        <br/>
        <Card>
            <CardContent>
                <Tabs>
                    <TabList>
                        <Tab onClick={handleChangeTabOt}><i className="bx bx-task"></i> Datos de la OT</Tab>
                        <Tab><i className='bx bx-wrench'></i> Técnicos</Tab>
                        <Tab onClick={handleChangeTabTareas}><i className='bx bx-list-ol'></i> Tareas</Tab>
                    </TabList>
                <TabPanel>
                    <Card>
                        <CardContent>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={3} lg={3} xl={3}>
                                    <TextField
                                    variant="outlined"
                                    value={GetFullName()}
                                    fullWidth
                                    label="Responsable de emisión de OT">
                                    </TextField>
                                </Grid>
                                <Grid item xs={6} md={3} lg={3} xl={3}>
                                    <TextField
                                        value={new Date().toLocaleDateString()}
                                        variant="outlined"
                                        fullWidth
                                        label="Fecha de emisión de OT"
                                    ></TextField>
                                </Grid>
                                <Grid item xs={6} md={2} lg={2} xl={2}>
                                    <TextField
                                        value={new Date().toLocaleTimeString()}
                                        variant="outlined"
                                        fullWidth
                                        label="Hora de emisión de OT"
                                    ></TextField>
                                </Grid>
                                <Grid item xs={12} md={4} lg={4} xl={4}>
                                    <DatePicker
                                    inputVariant="outlined"
                                    value={OtFechaPrevistaVisita}
                                    onChange={(fecha)=>setOtFechaPrevistaVisita(fecha)}
                                    format="dd/MM/yyyy"
                                    fullWidth
                                    label="Fecha prevista de visita"
                                    >
                                    </DatePicker>
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
                                    onChange={onInputChange}
                                    fullWidth
                                    label="Observaciones registro de OT">
                                    </TextField>
                                </Grid>
                            <Grid item xs={12} md={4} lg={4} xl={4}>
                                {location.state ?
                                <TextField
                                variant="outlined"
                                fullWidth
                                value={location.state.ApellidoAbonado + ', ' + location.state.NombreAbonado}
                                label="Apellido y nombre del abonado">
                                </TextField>
                                :
                                <Autocomplete
                                    value={abonadoOt}
                                    disableClearable
                                    onChange={(_event, newAbonado) => {
                                        setCargando(true);
                                        setTimeout(()=>{
                                            traerAbonado(newAbonado.UserId);
                                            setAbonadoOt(newAbonado);
                                            setCargando(false);
                                        }, 2000)
                                    }}
                                    options={abonados}
                                    noOptionsText="No se encontraron abonados"
                                    getOptionLabel={(option) => option.Apellido + ", " + option.Nombre}
                                    renderInput={(params) => <TextField {...params} variant = "outlined" fullWidth label="Abonado"/>}
                                    />
                                }
                            </Grid>
                            {cargando ? <Grid item xs={12} md={3} lg={3} xl={3}>Buscando domicilio...<LinearProgress /></Grid> :
                            <>
                            <Grid item xs={12} md={3} lg={3} xl={3}>
                                <TextField
                                    value={abonadoOt ? abonadoOt.DomicilioCalle + " " +  abonadoOt.DomicilioNumero : DomicilioCalle + " " + DomicilioNumero}
                                    variant="outlined"
                                    fullWidth
                                    label="Domicilio completo"
                                >
                                </TextField>
                            </Grid>
                            <Grid item xs={6} md={2} lg={2} xl={2}>
                                <TextField
                                    value={location.state ? location.state.MunicipioNombre : abonadoOt ? abonadoOt.MunicipioNombre : ""}
                                    variant="outlined"
                                    fullWidth
                                    label="Municipio"
                                >
                                </TextField>
                            </Grid>
                            <Grid item xs={6} md={3} lg={3} xl={3}>
                                <TextField
                                    value={location.state ? location.state.MunicipioNombre : abonadoOt ? abonadoOt.BarrioNombre : ""}
                                    variant="outlined"
                                    fullWidth
                                    label="Barrio"
                                >
                                </TextField>
                            </Grid>
                            </>
                            }
                            </Grid>
                        </CardContent>
                    </Card>
                    </TabPanel>
                    <TabPanel>
                        <Card>
                            <CardContent>
                                <Grid item xs={12} md={12} lg={12} xl={12}>
                                    <Autocomplete
                                    value={OtResponsableEjecucion}
                                    onChange={(_event, newTecnico) => {
                                        traerOrdenesDeTrabajoAsignadas(newTecnico.UserId, 5);
                                        setOtResponsableEjecucion(newTecnico);
                                    }}
                                    options={usuarios}
                                    noOptionsText="No se encontraron técnicos"
                                    getOptionLabel={(option) => option.Nombre +", "+ option.Apellido}
                                    renderInput={(params) => <TextField {...params} value={OtResponsableEjecucion} variant ="outlined" fullWidth label="Técnico encargado de ejecución"/>}
                                    />
                                </Grid>
                                <br/>
                                { OtResponsableEjecucion !== null ?
                                <Grid item xs={12} md={12} lg={12} xl={12}>
                                    <Typography variant="h6">Órdenes de trabajo pendientes y asignadas a: {OtResponsableEjecucion.Nombre}, {OtResponsableEjecucion.Apellido}</Typography>
                                    <br/>
                                    <Card>
                                        <CardContent>
                                        <Datatable
                                            loader
                                            datos={ordenesDeTrabajoAsignadas}
                                            columnas={columnasOt}>
                                        </Datatable>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                : ""}
                            </CardContent>
                        </Card>
                    </TabPanel>
                    <TabPanel>
                        <Card>
                            <CardContent>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={12} lg={12} xl={12}>
                                    <DataTable
                                        columns={columnasTareas}
                                        data={tareas}
                                        onSelectedRowsChange={row => setTareasOt(row.selectedRows)}  
                                        selectableRows
                                        selectableRowSelected={row => tareasOt.find((tarea) => tarea.TareaId === row.TareaId)}>
                                    </DataTable>
                                    </Grid>
                                </Grid>
                                {tareasOt.length > 0 && tareasOt.find((tareasOt => tareasOt.TareaId === 14 || tareasOt.TareaId === 15 )) ?
                                <>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={3} lg={3} xl={3}>
                                        <TextField
                                        variant = "outlined"
                                        onChange={handleChangeMunicipioSeleccionado}
                                        value={MunicipioId}
                                        label="Municipio nuevo domicilio"
                                        fullWidth
                                        select
                                        >
                                        <MenuItem value="">-</MenuItem>
                                        {municipios.length > 0 ? municipios.map((municipio)=>(
                                            <MenuItem key={municipio.MunicipioId} value={municipio.MunicipioId}>{municipio.MunicipioNombre}</MenuItem>
                                        )): <MenuItem disabled>No se encontraron municipios</MenuItem>}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} md={3} lg={3} xl={3}>
                                        <Autocomplete
                                        disableClearable
                                        value={barrio}
                                        onChange={(_event, nuevoBarrio) => {
                                            setBarrio(nuevoBarrio);
                                        }}
                                        options={barrios}
                                        noOptionsText="No se encontraron barrios"
                                        getOptionLabel={(option) => option.BarrioNombre}
                                        renderInput={(params) => <TextField {...params} variant = "outlined" fullWidth label="Barrio nuevo domicilio"/>}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={3} lg={3} xl={3}>
                                        <TextField
                                        variant = "outlined"
                                        value={DomicilioCalle}
                                        name="DomicilioCalle"
                                        onChange={onInputChange}
                                        fullWidth
                                        label="Calle nuevo domicilio">
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} md={2} lg={2} xl={2}>
                                        <TextField
                                        variant = "outlined"
                                        value={DomicilioNumero}
                                        name="DomicilioNumero"
                                        onChange={onInputChange}
                                        onKeyPress={(e) => {
                                            if (!/[0-9]/.test(e.key)) {
                                            e.preventDefault();
                                            }}}
                                        fullWidth
                                        label="Número nuevo domicilio">
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} md={1} lg={1} xl={1}>
                                        <TextField
                                        variant = "outlined"
                                        value={DomicilioPiso}
                                        name="DomicilioPiso"
                                        onChange={onInputChange}
                                        onKeyPress={(e) => {
                                            if (!/[0-9]/.test(e.key)) {
                                            e.preventDefault();
                                            }}}
                                        fullWidth
                                        label="Piso nuevo domicilio">
                                        </TextField>
                                    </Grid>
                                </Grid>
                                </>
                                : ""}
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                    <FormControl>
                                        <FormControlLabel label="Retira ONU" control={<Checkbox checked={OtRetiraOnu} onClick={handleChangeRetiraOnu}></Checkbox>}></FormControlLabel>
                                        <FormControlLabel label="Retira Cable" control={<Checkbox checked={OtRetiraCable} onClick={handleChangeRetiraCable}></Checkbox>}></FormControlLabel>
                                    </FormControl>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </TabPanel>
                    <br/>
                    <Alert severity="info"><b>ACLARACIÓN:</b> EL NUEVO DOMICILIO ÚNICAMENTE SE DEBE LLENAR PARA <b>CAMBIO DE DOMICILIO</b> Y LOS CHECKBOX DE RETIRO UNICAMENTE PARA <b>DESCONEXIÓN</b></Alert>
                    <br/>
                    <div style={{textAlign: 'center', marginBottom: '1.5rem'}}>
                        <Button type="submit" startIcon={<i className={location.state ? "bx bx-edit":"bx bx-check"}></i>}
                        variant="contained" color="primary">
                        {location.state ? "Modificar" : "Registrar"}
                    </Button>
                    </div>
                </Tabs>
            </CardContent>
        </Card>
        </form>
        </main>
        <Footer/>
        </div>
        </>
        );
}
 
export default CaratulaOt;