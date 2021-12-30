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

const CaratulaOT = () => {
    const appContext = useContext(AppContext);
    const { tareas, abonado, abonados, municipios, barrios, usuarios, traerBarriosPorMunicipio, traerMunicipios,
    traerTareas, traerAbonados, traerAbonado, traerUsuariosPorRol, traerTareasOt, traerTecnicosOt, tecnicosOrdenDeTrabajo, tareasOrdenDeTrabajo,
    crearOrdenDeTrabajo, modificarOrdenDeTrabajo, usuarioLogueado } = appContext;

    const location = useLocation();

    const [cargando, setCargando] = useState(false);
    const [tecnicosOt, setTecnicosOt] = useState([]);
    const [tareasOt, setTareasOt] = useState([]);
    const [abonadoOt, setAbonadoOt] = useState(null);
    const [barrio, setBarrio] = useState(null);
    const [MunicipioId, setMunicipioId] = useState(0);
    const [OtRetiraOnu, setOtRetiraOnu]= useState(0);
    const [OtRetiraCable, setOtRetiraCable]= useState(0);

    useEffect(()=>{
        traerTareas();
        traerMunicipios();
        traerAbonados();
        traerUsuariosPorRol(process.env.ID_ROL_TECNICO);
    },[])

    useEffect(()=>{
        if(location.state){
            setOtInfo(location.state);
            traerTareasOt(location.state.OtId);
            traerTecnicosOt(location.state.OtId);
            setTareasOt(tareasOrdenDeTrabajo);
            setTecnicosOt(tecnicosOrdenDeTrabajo);
        }
    },[])

    const [OtInfo, setOtInfo] = useState({
        OtId: null,
        DomicilioCalle: "",
        DomicilioNumero: "",
        DomicilioPiso: null,
        OtObservacionesResponsableEmision: null,
        createdBy: null,
        updatedAt : null,
        updatedBy: null
    })
    const [OtFechaPrevistaVisita, setOtFechaPrevistaVisita] = useState(new Date());
    const {OtId, DomicilioCalle, DomicilioNumero, DomicilioPiso, OtObservacionesResponsableEmision } = OtInfo;

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
        setAbonadoOt({
            ...abonado
        });
    }
    const handleChangeTabTecnicos = () => {
        setTecnicosOt(tecnicosOrdenDeTrabajo);
    }
    const handleChangeTabTareas = () => {
        setTareasOt(tareasOrdenDeTrabajo);
    }
    const onSubmitOT = (e) => {
        e.preventDefault();
        if(!location.state) {
            setOtInfo({
                ...OtInfo,
                createdBy: usuarioLogueado.User.UserId
            });
            crearOrdenDeTrabajo({
                OtInfo,
                OtFechaPrevistaVisita,
                abonado,
                tecnicosOt,
                tareasOt,
                barrio,
                OtRetiraCable,
                OtRetiraOnu
            });
        }
        else {
            setOtInfo({
                ...OtInfo,
                OtId: location.state.OtId,
                updatedBy: usuarioLogueado.User.UserId,
                updatedAt: new Date()
            });
            modificarOrdenDeTrabajo({
                OtInfo,
                OtFechaPrevistaVisita,
                abonado,
                tecnicosOt,
                tareasOt,
                barrio,
                OtRetiraCable,
                OtRetiraOnu
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
            "name": "Precio Unitario",
            "selector": row => "$ " + row["TareaPrecioUnitario"],
        }
    ]
    const columnasTecnicos = [
        {
            "name": "id",
            "selector": row => row["UserId"],
            "omit": true
        },
        {
            "name": "Nombre Completo",
            "selector": row => row["Apellido"] + ", " +  row["Nombre"],
        }
    ]

    return ( 
        <>
        <div className="container">
        <Aside/>
        <main>
        <form onSubmit={onSubmitOT}>
        <Tabs>
            <TabList>
                <Tab><i onClick={handleChangeTabOt} style={{color: 'teal'}} className="bx bx-task"></i> Datos de la OT</Tab>
                <Tab><i onClick={handleChangeTabTecnicos} style={{color: 'teal'}} className='bx bxs-wrench'></i> Técnicos</Tab>
                <Tab><i onClick={handleChangeTabTareas} style={{color: 'teal'}} className='bx bx-list-ol'></i> Tareas</Tab>
            </TabList>
        <TabPanel>
            <Card>
                <CardContent>
                    <Typography variant="h1">Nueva Orden de Trabajo</Typography>
                    <Typography variant="h2"><i className="bx bx-task"></i> Datos de la OT</Typography>
                    <br/>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={3} lg={3} xl={3}>
                            <TextField
                            variant="outlined"
                            value={localStorage.getItem('usr')}
                            fullWidth
                            label="Responsable de emisión de OT">
                            </TextField>
                        </Grid>
                        <Grid item xs={6} md={3} lg={3} xl={3}>
                            <TextField
                                value={location.state ? location.state.createdAt.split('T')[0].split('-').reverse().join('/') : new Date().getDate()+"/"+(new Date().getMonth()+1) +"/"+new Date().getFullYear()}
                                variant="outlined"
                                fullWidth
                                label="Fecha de emisión de OT"
                            ></TextField>
                        </Grid>
                        <Grid item xs={6} md={3} lg={3} xl={3}>
                            <TextField
                                value={location.state ? location.state.createdAt.split('T')[1].split('.')[0] : new Date().toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})}
                                variant="outlined"
                                fullWidth
                                label="Hora de emisión de OT"
                            ></TextField>
                        </Grid>
                        <Grid item xs={12} md={3} lg={3} xl={3}>
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
                    </Grid>
                    <Typography variant="h2"><i className="bx bx-user"></i> Datos del abonado</Typography>
                    <Grid container spacing={3}>
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
                    <Typography variant="h2"><i className="bx bx-wrench"></i> Encargados de ejecución</Typography>
                    <DataTable
                        columns={columnasTecnicos}
                        data={usuarios}
                        onSelectedRowsChange={row => setTecnicosOt(row.selectedRows)}
                        selectableRows
                        selectableRowSelected={row => tecnicosOt.find((tecnico) => tecnico.UserId === row.UserId)}>
                    </DataTable>
                    </CardContent>
                </Card>
            </TabPanel>
            <TabPanel>
                <Card>
                    <CardContent>
                        <Typography variant="h2"><i className="bx bx-task"></i> Tareas a realizar</Typography>
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
                                type="number"
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
                                type="number"
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
        </form>
        </main>
        <Footer/>
        </div>
        </>
        );
}
 
export default CaratulaOT;