import React, { useState, useContext, useEffect } from 'react';
import { Button, Card, CardContent, Checkbox, FormControl, FormControlLabel, Grid, MenuItem, TextField, Typography } from '@material-ui/core';
import Aside from '../design/layout/Aside';
import Footer from '../design/layout/Footer';
import Modal from '../design/components/Modal';
import AppContext from '../../../context/appContext';
import { Alert, Autocomplete } from '@material-ui/lab';
import { useLocation } from 'react-router';
import olinet from '../../images/olinet.PNG';
import logo3 from '../../images/logo3.PNG';

const CaratulaOT = () => {
    const appContext = useContext(AppContext);
    const { tiposTareas, abonados, municipios, barrios, usuarios, traerBarriosPorMunicipio, traerMunicipios,
    traerTiposTareas, traerAbonados, traerAbonado, traerUsuariosPorRol } = appContext;
    useEffect(()=>{
        traerTiposTareas();
        traerBarriosPorMunicipio(0);
        traerMunicipios();
        traerAbonados();
        traerUsuariosPorRol('3EF5B486-2604-44E6-BA2C-D9F78BF7A612');
    },[]);
    const location = useLocation();
    const [OtInfo, setOtInfo] = useState({
        NuevoDomicilioCalle: null,
        NuevoDomicilioNumero: null,
        NuevoDomicilioPiso: null,
        createdBy: null
    })
    const {NuevoDomicilioCalle, NuevoDomicilioNumero, NuevoDomicilioPiso } = OtInfo;
    const onInputChange = (e) => {
        setOtInfo({
            ...OtInfo,
            [e.target.name] : e.target.value
        });
    }

    const [ModalConfirmarOt, setModalConfirmarOt] = useState(false);
    const [Tecnico, setTecnico] = useState();
    const [Abonado, setAbonado] = useState();
    const [Tarea, setTarea] = useState();
    const [Barrio, setBarrio] = useState(null);
    const [MunicipioId, setMunicipioId] = useState(0);
    const [MunicipioNombre, setMunicipioNombre] = useState('');

    const handleChangeMunicipioSeleccionado = (e) => {
        setMunicipioId(e.target.value);
        setBarrio(null);
        traerBarriosPorMunicipio(e.target.value);
    }
    const handleChangeModalConfirmarOt = () => {
        setModalConfirmarOt(!ModalConfirmarOt);
    }
    const onSubmitOT = (e) => {
        e.preventDefault();
    }

    return ( 
        <>
        <div className="container">
        <Aside/>
        <main>
        <form onSubmit={onSubmitOT}>
        <Card>
            <CardContent>
                <Typography variant="h1">Nueva Orden de Trabajo</Typography>
                <Typography variant="h2"><i className="bx bx-file-blank"></i> Datos de la OT</Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4} lg={4} xl={4}>
                        <TextField
                        variant="outlined"
                        value={localStorage.getItem('usr')}
                        fullWidth
                        label="Responsable de emisión de OT">
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={4} lg={4} xl={4}>
                        <Autocomplete
                            multiple
                            disableCloseOnSelect
                            disableClearable
                            value={location.state ? location.state.BarrioNombre : Abonado}
                            onChange={(_event, newTecnico) => {
                                setTecnico(newTecnico);
                            }}
                            options={usuarios}
                            noOptionsText="No se encontraron técnicos"
                            getOptionLabel={(option) => option.Apellido + ", " + option.Nombre}
                            renderInput={(params) => <TextField {...params} variant = {location.state ? "filled" : "outlined"} fullWidth label="Responsable/s de ejecución"/>}
                        />
                    </Grid>
                    <Grid item xs={6} md={2} lg={2} xl={2}>
                        <TextField
                            value={new Date().getDate()+"/"+(new Date().getMonth()+1) +"/"+new Date().getFullYear()}
                            variant="outlined"
                            fullWidth
                            label="Fecha de emisión de OT"
                        ></TextField>
                    </Grid>
                    <Grid item xs={6} md={2} lg={2} xl={2}>
                        <TextField
                            value={new Date().toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})}
                            variant="outlined"
                            fullWidth
                            label="Hora de emisión de OT"
                        ></TextField>
                    </Grid>
                </Grid>
                <Typography variant="h2"><i className="bx bx-user"></i> Datos del abonado</Typography>
                <Grid container spacing={3}>
                <Grid item xs={12} md={4} lg={4} xl={4}>
                    <Autocomplete
                        value={location.state ? location.state.BarrioNombre : Abonado}
                        disableClearable
                        onChange={(_event, newAbonado) => {
                            setAbonado(newAbonado);
                            traerAbonado(newAbonado.UserId);
                        }}
                        options={abonados}
                        noOptionsText="No se encontraron abonados"
                        getOptionLabel={(option) => option.Apellido + ", " + option.Nombre}
                        renderInput={(params) => <TextField {...params} variant = {location.state ? "filled" : "outlined"} fullWidth label="Abonado"/>}
                        />
                </Grid>
                <Grid item xs={12} md={3} lg={3} xl={3}>
                    <TextField
                        value={Abonado ? Abonado.DomicilioCalle + " " +  Abonado.DomicilioNumero : ""}
                        variant="outlined"
                        fullWidth
                        label="Domicilio completo"
                    >
                    </TextField>
                </Grid>
                <Grid item xs={6} md={2} lg={2} xl={2}>
                    <TextField
                        value={Abonado ? Abonado.MunicipioNombre : "" }
                        variant="outlined"
                        fullWidth
                        label="Municipio"
                    >
                    </TextField>
                </Grid>
                <Grid item xs={6} md={3} lg={3} xl={3}>
                    <TextField
                        value={Abonado ? Abonado.BarrioNombre : ""}
                        variant="outlined"
                        fullWidth
                        label="Barrio"
                    >
                    </TextField>
                </Grid>
                </Grid>
                <Typography variant="h2"><i className="bx bx-task"></i> Tareas a realizar</Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={12} lg={12} xl={12}>
                        <Autocomplete
                        multiple
                        disableCloseOnSelect
                        disableClearable
                        value={location.state ? location.state.BarrioNombre : Abonado}
                        onChange={(_event, newTarea) => {
                            setTarea(newTarea);
                        }}
                        options={tiposTareas}
                        noOptionsText="No se encontraron tareas"
                        getOptionLabel={(option) => option.TipoTareaNombre}
                        renderInput={(params) => <TextField {...params} variant = {location.state ? "filled" : "outlined"} fullWidth label="Tarea/s"/>}
                        />
                    </Grid>
                </Grid>
                {/* SOLO CAMBIO DE DOMICILIO */}
                <br/>
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
                        value={Barrio}
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
                        value={NuevoDomicilioCalle}
                        name="NuevoDomicilioCalle"
                        onChange={onInputChange}
                        fullWidth
                        label="Calle nuevo domicilio">
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={2} lg={2} xl={2}>
                        <TextField
                        variant = "outlined"
                        value={NuevoDomicilioNumero}
                        name="NuevoDomicilioNumero"
                        onChange={onInputChange}
                        type="number"
                        fullWidth
                        label="Número nuevo domicilio">
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={1} lg={1} xl={1}>
                        <TextField
                        variant = "outlined"
                        value={NuevoDomicilioPiso}
                        name="NuevoDomicilioPiso"
                        onChange={onInputChange}
                        type="number"
                        fullWidth
                        label="Piso nuevo domicilio">
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={12} lg={12} xl={12}>
                        <TextField
                        variant = "outlined"
                        multiline
                        minRows={3}
                        //value={CambioServicioObservaciones}
                        name="OtObservaciones"
                        inputProps={{
                            maxLength: 1000
                        }}
                        //onChange={onInputChange}
                        fullWidth
                        label="Observaciones">
                        </TextField>
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                    <FormControl>
                        <FormControlLabel label="Retira ONU" control={<Checkbox></Checkbox>}></FormControlLabel>
                        <FormControlLabel label="Retira Cable" control={<Checkbox></Checkbox>}></FormControlLabel>
                    </FormControl>
                    </Grid>
                </Grid>
            <Alert severity="info"><b>ACLARACIÓN:</b> EL NUEVO DOMICILIO ÚNICAMENTE SE DEBE LLENAR PARA <b>CAMBIO DE DOMICILIO</b> Y LOS CHECKBOX DE RETIRO UNICAMENTE PARA <b>DESCONEXIÓN</b></Alert>
            <br/>
            </CardContent>
            <Modal
            abrirModal={ModalConfirmarOt}
            funcionCerrar={handleChangeModalConfirmarOt}
            titulo={
                <>
                <div style={{display: 'flex'}}>
                    <img src={logo3} alt="" style={{width: '6rem', height: '3rem', marginRight: '3rem'}}/>
                    <Typography variant="h1">Orden de trabajo N°1800</Typography>
                    <img src={olinet} alt="" style={{width: '6rem', height: '3rem', marginLeft: '3rem'}}/>
                </div>
                </>
            }
            formulario={
                <>
                <Typography variant="h6"><b>Responsable de emisión: </b>{localStorage.getItem('usr')}</Typography>
                <hr/>
                <br/>
                <Typography variant="h6"><b>Responsable de ejecución: </b></Typography>
                <hr/>
                <br/>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <Typography variant="h6"><b>Fecha de emisión OT:</b> {new Date().getDate()+"/"+(new Date().getMonth()+1) +"/"+new Date().getFullYear()}</Typography>
                    <Typography variant="h6"><b>Hora: </b>{new Date().toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})}</Typography>
                </div>
                <hr/>
                <br/>
                <Typography variant="h6"><b>Abonado:</b></Typography>
                <hr/>
                <br/>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <Typography variant="h6"><b>Localidad:</b></Typography>
                    <Typography variant="h6"><b>Barrio: </b></Typography>
                </div>
                <hr/>
                <br/>
                <Typography variant="h6"><b>Domicilio:</b></Typography>
                <hr/>
                <br/>
                <Typography variant="h6"><b>Tarea a realizar:</b></Typography>
                <hr/>
                <br/>
                <Typography variant="h6"><b>Observaciones:</b></Typography>
                <hr/>
                <br/>
                <div style={{marginLeft: '10rem', display: 'flex', justifyContent: 'space-between'}}>
                <Typography variant="h6"><b>1era visita:</b></Typography>
                <Typography variant="h6"><b>2da visita:</b></Typography>
                <Typography variant="h6"><b>3era visita:</b></Typography>
                <br/>
                <br/>
                </div>
                <Typography variant="h6"><b>Fecha de realización:</b></Typography>
                <hr/>
                <br/>
                <Typography variant="h6"><b>Hora de inicio:</b></Typography>
                <hr/>
                <br/>
                <Typography variant="h6"><b>Hora de finalización:</b></Typography>
                <hr/>
                <br/>
                <FormControl>
                        <FormControlLabel label="Se verificó señal" control={<Checkbox></Checkbox>}></FormControlLabel>
                </FormControl>
                <Typography variant="h6"><b>Observaciones:</b></Typography>
                <br/>
                <br/>
                <br/>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <Typography variant="h6"><b>Firma responsable de ejecución</b></Typography>
                <Typography variant="h6"><b>Conformidad del abonado</b></Typography>
                </div>
                </>
            }
            ></Modal>
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
 
export default CaratulaOT;