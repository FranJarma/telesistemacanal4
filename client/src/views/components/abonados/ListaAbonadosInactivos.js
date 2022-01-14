import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../../../context/appContext';
import Aside from '../design/layout/Aside';
import Footer from '../design/layout/Footer';
import './../design/layout/styles/styles.css';
import { Button, Card, CardContent, FormHelperText, Grid, MenuItem, TextField, Tooltip, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import Datatable from '../design/components/Datatable';
import Modal from '../design/components/Modal';
import BotonesDatatable from '../design/components/BotonesDatatable';

const ListaAbonadosInactivos = () => {
    const appContext = useContext(AppContext);
    const { usuarioLogueado, abonados, municipios, traerAbonados, traerMunicipiosPorProvincia, cambiarEstadoAbonado } = appContext;

    useEffect(() => {
        traerAbonados(3);
        //10 para que traiga los de jujuy
        traerMunicipiosPorProvincia(10);
    },[]);

    const [municipioSeleccionadoId, setMunicipioSeleccionadoId] = useState(0);
    const [modalDarDeAlta, setModalDarDeAlta] = useState(false);

    const [AbonadoInfo, setAbonadoInfo] = useState({
        UserId: null,
        EstadoId: null,
        CambioEstadoObservaciones: null,
        createdBy: null,
        updatedAt: null,
        updatedBy: null,
        deletedBy: null,
        deletedAt: null
    });

    const { CambioEstadoObservaciones } = AbonadoInfo;

    const handleChangeModalDarDeAlta = (data) => {
        setModalDarDeAlta(!modalDarDeAlta)
        if(!modalDarDeAlta){
            setAbonadoInfo({
                UserId: data.UserId,
                EstadoId: 1,
                CambioEstadoFecha: new Date().toJSON(),
            })
        }
        else {
            setAbonadoInfo({
                UserId: null
            })
        }
    }

    const onChangeInputEstadoObservaciones = (e) => {
        setAbonadoInfo({
            ...AbonadoInfo,
            [e.target.name] : e.target.value
        });
    }
    const handleChangeMunicipioSeleccionado = (e) => {
        setMunicipioSeleccionadoId(e.target.value);
        traerAbonados(3, e.target.value);
    }

    const columnaAbonadosInactivos = [
        {
            "name": "id",
            "omit": true,
            "selector": row =>row["UserId"]
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
            "sortable": true
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
            "sortable": true
        },
        {
            cell: (data) =>
            <BotonesDatatable botones={
                <>
                <MenuItem>
                    <Typography onClick={()=>handleChangeModalDarDeAlta(data)} style={{textDecoration: 'none', color: "blue", cursor: "pointer"}}><i className='bx bxs-user-check bx-xs'></i> DAR DE ALTA</Typography>
                </MenuItem>
                </>
            }/>
        }
]
const ExpandedComponent = ({ data }) =>
<>
    <Typography style={{fontWeight: 'bold'}} variant="h6"><i className="bx bx-id-card"></i> DNI: {data.Documento}</Typography>
    <Typography style={{fontWeight: 'bold'}} variant="h6"><i className="bx bx-home"></i> Domicilio: {data.DomicilioCalle} {data.DomicilioNumero} | Barrio {data.BarrioNombre} | {data.MunicipioNombre}</Typography>
</>;
    return (
        <>
        <div className="container">
        <Aside/>
        <main>
        <Card>
            <CardContent>
                <Typography variant="h1">Abonados Inactivos <Tooltip arrow title="Los abonados inactivos son aquellos que fueron dados de baja por diversos motivos. Por ej: Mora, conexión Clandestina, etc">
                <i style={{color: 'blue'}} className="bx bxs-help-circle bx-tada-hover bx-sm"></i></Tooltip>
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
                abrirModal={modalDarDeAlta}
                funcionCerrar={handleChangeModalDarDeAlta}
                titulo={<Alert severity="success" icon={<i className="bx bxs-user-check bx-sm"></i>}>Si usted da de alta al abonado, pasará al listado de <b>Abonados Inscriptos</b></Alert>}
                botones={
                <>
                <Button onClick={()=>
                    {cambiarEstadoAbonado(AbonadoInfo)
                    setModalDarDeAlta(false)}}
                    variant="contained"
                    color="primary">
                    Aceptar</Button>
                <Button onClick={handleChangeModalDarDeAlta}>Cerrar</Button></>}
                formulario={
                <>
                <TextField
                autoFocus
                variant="outlined"
                name="CambioEstadoObservaciones"
                value={CambioEstadoObservaciones}
                fullWidth
                onChange={onChangeInputEstadoObservaciones}
                >
                </TextField>
                <FormHelperText>Ingrese motivo de alta</FormHelperText>
                </>}
                >
                </Modal>
                <Datatable
                    loader={true}
                    columnas={columnaAbonadosInactivos}
                    datos={abonados}
                    expandedComponent={ExpandedComponent}
                    paginacion={true}
                    buscar={true}/>
                </CardContent>
            </Card>
        </main>
        <Footer/>
        </div>
        </>
    );
}
 
export default ListaAbonadosInactivos;