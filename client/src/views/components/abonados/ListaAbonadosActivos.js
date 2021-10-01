import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../../../context/appContext';
import Aside from '../design/layout/Aside';
import Footer from '../design/layout/Footer';
import './../design/layout/styles/styles.css';
import { Button, Card, CardContent, CardHeader, FormHelperText, Grid, MenuItem, TextField, Tooltip, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import Datatable from '../design/components/Datatable';
import Modal from '../design/components/Modal';
import { Link } from 'react-router-dom';
import useStyles from '../Styles';

const ListaAbonadosActivos = () => {
    const appContext = useContext(AppContext);
    const { abonados, municipios, traerAbonadosActivos, traerMunicipiosPorProvincia, darDeBajaAbonado } = appContext;

    useEffect(() => {
        traerAbonadosActivos();
        //10 para que traiga los de jujuy
        traerMunicipiosPorProvincia(10);
    },[]);

    const [municipioSeleccionadoId, setMunicipioSeleccionadoId] = useState(0);
    const [modalDarDeBaja, setModalDarDeBaja] = useState(false);

    const [infoBaja, setInfoBaja] = useState({
        idAbonadoBaja: null,
        motivoBaja: null
    });

    const { motivoBaja } = infoBaja;

    const handleChangeModalDarDeBaja = (data) => {
        setModalDarDeBaja(!modalDarDeBaja)
        if(!modalDarDeBaja){
            setInfoBaja({
                idAbonadoBaja: data.UserId
            })
        }
        else {
            setInfoBaja({
                idAbonadoBaja: null
            })
        }
    }

    const onChangeInputMotivoBaja = (e) => {
        setInfoBaja({
            ...infoBaja,
            [e.target.name] : e.target.value
        });
    }
    const handleChangeMunicipioSeleccionado = (e) => {
        setMunicipioSeleccionadoId(e.target.value);
        traerAbonadosActivos(e.target.value);
    }

    const styles = useStyles();

    const columnasAbonadosActivos = [
    {
        "name": "id",
        "selector": row =>row["UserId"],
        "omit": true,
    },
    {
        "name": "Nombre",
        "selector": row =>row["Nombre"],
        "omit": true
    },
    {
        "name": "Apellido",
        "selector": row =>row["Apellido"],
        "omit": true
    },
    {
        "name": "Nombre Completo",
        "selector": row => row["Apellido"] + ', ' + row["Nombre"]
    },
    {
        "name": "BarrioId",
        "selector": row => row["BarrioId"],
        "omit": true
    },
    {
        "name": "MunicipioId",
        "selector": row => row["MunicipioId"],
        "omit": true
    },
    {
        "name": "DomicilioId",
        "selector": row => row["DomicilioId"],
        "omit": true
    },
    {
        "name": "Domicilio Calle",
        "selector": row => row["DomicilioCalle"],
        "omit": true
    },
    {
        "name": "Domicilio Numero",
        "selector": row => row["DomicilioNumero"],
        "omit": true
    },
    {
        "name": "Domicilio",
        "selector": row => row["DomicilioCalle"] + ', ' + row["DomicilioNumero"] + ' | ' + row["BarrioNombre"] + ' | ' +  row["MunicipioNombre"]
    },
    {
        "name": "N° teléfono",
        "selector": row =>row["Telefono"],
        "omit": true,
    },
    {
        "name": "DNI",
        "selector": row =>row["Documento"],
        "sortable": true,
        "hide": "sm"
    },
    {
        "name": "ServicioId",
        "selector": row =>row["ServicioId"],
        "omit": true
    },
    {
        "name": "Servicio",
        "selector": row =>row["ServicioNombre"],
        "sortable": true,
        "hide": "sm",
    },
    {
        "name": "Fecha de Contrato",
        "selector": row =>row["FechaContrato"].split('T')[0],
        "omit": true
    },
    {
        "name": "Fecha de Bajada",
        "selector": row =>row["FechaBajada"].split('T')[0],
        "omit": true,
    },
    // {
    //     "name": "ONU MAC",
    //     "selector": row =>row["OnuMac"],
    //     "sortable": true,
    //     "omit": true
    // },
    {
        cell: (data) =>
        <>
        <Link to={{
            pathname: `/caratula-abonado/edit/UserId=${data.UserId}`,
            state: data
        }}
        style={{textDecoration: 'none', color: "teal"}}>
        <Tooltip title="Editar"><i className="bx bxs-edit bx-xs"></i></Tooltip>
        </Link>
        <Link to={{
            pathname: `/domicilios-abonado/UserId=${data.UserId}`,
            state: data
        }}
        style={{textDecoration: 'none', color: "indigo"}}>
        <Tooltip title="Cambio de domicilio"><i className="bx bxs-home bx-xs"></i></Tooltip>
        </Link>
        <Link to={{
            pathname: `/cambio-titularidad/UserId=${data.UserId}`,
            state: data
        }}
        style={{textDecoration: 'none', color: "coral"}}>
        <Tooltip title="Cambio de titularidad"><i className="bx bxs-notepad bx-xs"></i></Tooltip>
        </Link>
        <Link to={{
            pathname: `/historial-de-pagos/UserId=${data.UserId}`,
            state: data
        }}
        style={{textDecoration: 'none', color: "navy"}}>
        <Tooltip title="Historial de pagos"><i className="bx bx-money bx-xs"></i></Tooltip>
        </Link>
        <Typography onClick={()=>handleChangeModalDarDeBaja(data)} style={{textDecoration: 'none', color: "red", cursor: "pointer"}}><Tooltip title="Dar de baja"><i className='bx bxs-user-x bx-xs'></i></Tooltip></Typography>
        </>,
    }
]
    const ExpandedComponent = ({ data }) =>
    <>
        <Typography style={{fontWeight: 'bold'}} variant="h6"><i className="bx bx-home"></i> Domicilio: {data.DomicilioCalle} {data.DomicilioNumero} - {data.BarrioNombre}</Typography>
        <Typography style={{fontWeight: 'bold'}} variant="h6"><i className="bx bx-id-card"></i> DNI: {data.Documento}</Typography>
        <Typography style={{fontWeight: 'bold'}} variant="h6"><i className="bx bx-plug"></i> Servicio: {data.ServicioNombre}</Typography>
    </>;
    return (
        <>
        <div className="container">
        <Aside/>
        <main>
        <Card className={styles.cartaPrincipal}>
            <CardHeader
            action={<Link style={{textDecoration: 'none'}} to="/caratula-abonado"><Button variant="contained" color="primary">+ Nuevo Abonado</Button></Link>}>
            </CardHeader>
            <CardContent>
                <Typography variant="h1">Abonados Activos</Typography>
                <br/>
                <Grid item xs={12} md={2} lg={2} xl={2}>
                    <TextField
                    onChange={handleChangeMunicipioSeleccionado}
                    value={municipioSeleccionadoId}
                    label="Municipio"
                    fullWidth
                    select
                    variant="outlined"
                    >
                    <MenuItem value={0}>Todos</MenuItem>
                    {municipios.length > 0 ? municipios.map((municipio)=>(
                        <MenuItem key={municipio.MunicipioId} value={municipio.MunicipioId}>{municipio.MunicipioNombre}</MenuItem>
                    )): <MenuItem disabled>No se encontraron municipios</MenuItem>}
                    </TextField>
                </Grid>
                <Modal
                abrirModal={modalDarDeBaja}
                funcionCerrar={handleChangeModalDarDeBaja}
                titulo={<Alert severity="error" icon={<i className="bx bxs-user-x bx-sm"></i>}>Si usted da de baja al abonado, pasará al listado de <b>Abonados Inactivos</b></Alert>}
                botones={
                <>
                <Button onClick={()=>
                    {darDeBajaAbonado(infoBaja)
                    setModalDarDeBaja(false)}}
                    variant="contained"
                    color="secondary">
                    Aceptar</Button>
                <Button onClick={handleChangeModalDarDeBaja}>Cerrar</Button></>}
                formulario={
                <>
                <TextField
                className={styles.inputModal}
                autoFocus
                variant="outlined"
                name="motivoBaja"
                value={motivoBaja}
                fullWidth
                onChange={onChangeInputMotivoBaja}
                >
                </TextField>
                <FormHelperText>Ingrese motivo de baja</FormHelperText>
                </>}
                >
                </Modal>
                <Datatable
                    columnas={columnasAbonadosActivos}
                    datos={abonados}
                    expandedComponent={ExpandedComponent}
                />
            </CardContent>
        </Card>
        </main>
        <Footer/>
        </div>
        </>
    );
}
 
export default ListaAbonadosActivos;