import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../../../context/appContext';
import Aside from '../design/layout/Aside';
import Footer from '../design/layout/Footer';
import './../design/layout/styles/styles.css';
import { Button, Card, CardContent, Grid, MenuItem, TextField, Tooltip, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import Datatable from '../design/components/Datatable';
import Modal from '../design/components/Modal';
import useStyles from '../Styles';

const ListaAbonadosInactivos = () => {
    const appContext = useContext(AppContext);
    const { abonados, municipios, traerAbonadosInactivos, traerMunicipiosPorProvincia, darDeBajaAbonado } = appContext;

    useEffect(() => {
        traerAbonadosInactivos();
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
        traerAbonadosInactivos(e.target.value);
    }

    const styles = useStyles();

    const columnasAbonadosActivos = [
        {
            "name": "id",
            "omit": true,
            "selector": row =>row["UserId"],
            "sortable": true,
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
            "selector": row => row["Apellido"] + ', ' + row["Nombre"],
            "wrap": true,
        },
        {
            "name": "DNI",
            "selector": row =>row["Documento"],
            "sortable": true,
            "hide": "sm"
        },
        {
            "name": "N° teléfono",
            "selector": row =>row["Phone"],
            "sortable": true,
            "omit": true,
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
            "selector": row => row["DomicilioCalle"] + ', ' + row["DomicilioNumero"] + ' | ' +  "Barrio " + row["BarrioNombre"] + ' | ' +  row["MunicipioNombre"],
            "wrap": true,
        },
        {
            "name": "Datos última baja",
            "selector": row =>'Fecha: ' + row["CambioEstadoFecha"].split('T')[0].split('-').reverse().join('/') + ' | Motivo: ' +  row["CambioEstadoObservaciones"],
            "sortable": true,
            "hide": "sm",
            "wrap": true
        },
    {
        cell: (data) =>
        <>
        <Typography onClick={()=>handleChangeModalDarDeBaja(data)} style={{textDecoration: 'none', color: "teal", cursor: "pointer"}}><Tooltip title="Historial de bajas"><i className='bx bx-task-x'></i></Tooltip></Typography>
        <Typography onClick={()=>handleChangeModalDarDeBaja(data)} style={{textDecoration: 'none', color: "blue", cursor: "pointer"}}><Tooltip title="Dar de alta"><i className='bx bxs-user-check bx-xs'></i></Tooltip></Typography>
        </>,
    }
]
const ExpandedComponent = ({ data }) =>
<>
    <Typography style={{fontWeight: 'bold'}} variant="h6"><i className="bx bx-id-card"></i> DNI: {data.Documento}</Typography>
    <Typography style={{fontWeight: 'bold'}} variant="h6"><i className="bx bx-home"></i> Domicilio: {data.DomicilioCalle} {data.DomicilioNumero} | Barrio {data.BarrioNombre} | {data.MunicipioNombre}</Typography>
    <Typography style={{fontWeight: 'bold'}} variant="h6"><i class="bx bx-calendar"></i> Fecha de baja: {data.CambioEstadoFecha.split('T')[0].split('-').reverse().join('/')}</Typography>
    <Typography style={{fontWeight: 'bold'}} variant="h6"><i class="bx bx-question-mark"></i> Motivo de baja: {data.CambioEstadoObservaciones}</Typography>
</>;
    return (
        <>
        <div className="container">
        <Aside/>
        <main>
        <Card>
            <CardContent>
                <Typography variant="h1">Abonados Inactivos <Tooltip arrow title="Los abonados inactivos son aquellos que fueron dados de baja por diversos motivos. Por ej: Mora, conexión Clandestina, etc">
                <i style={{color: 'grey'}} className="bx bx-help-circle bx-tada-hover bx-sm"></i></Tooltip>
                </Typography>                <br/>
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
                titulo={<Alert severity="success" icon={<i className="bx bxs-user-check bx-sm"></i>}>Si usted da de alta al abonado, pasará al listado de <b>Abonados Activos</b></Alert>}
                botones={
                <>
                <Button onClick={()=>
                    {darDeBajaAbonado(infoBaja)
                    setModalDarDeBaja(false)}}
                    variant="contained"
                    color="primary">
                    Aceptar</Button>
                <Button onClick={handleChangeModalDarDeBaja}>Cerrar</Button></>}
                // formulario={
                // <>
                // <TextField
                // className={styles.inputModal}
                // autoFocus
                // variant="outlined"
                // name="motivoBaja"
                // value={motivoBaja}
                // fullWidth
                // onChange={onChangeInputMotivoBaja}
                // >
                // </TextField>
                // <FormHelperText>Ingrese motivo de alta</FormHelperText>
                // </>}
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
 
export default ListaAbonadosInactivos;