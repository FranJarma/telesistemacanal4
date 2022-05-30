import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../../../context/appContext';
import Aside from '../design/layout/Aside';
import Footer from '../design/layout/Footer';
import './../design/layout/styles/styles.css';
import { Button, Card, CardContent, FormHelperText, Grid, MenuItem, TextField, Tooltip, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import Datatable from '../design/components/Datatable';
import Modal from '../design/components/Modal';
import { Link } from 'react-router-dom';
import useStyles from '../Styles';
import BotonesDatatable from '../design/components/BotonesDatatable';
import TooltipForTable from '../../../helpers/TooltipForTable';
import SpanVencimientoServicio from '../../../helpers/SpanVencimientoServicio';
import SpanServicio from '../../../helpers/SpanServicio';
import formatDocumento from '../../../helpers/FormatDocumento';
import GetUserId from './../../../helpers/GetUserId';

const ListaAbonadosActivos = () => {
    const appContext = useContext(AppContext);
    const { abonados, municipios, traerAbonados, traerMunicipiosPorProvincia, cambiarEstadoAbonado, renovarContratoAbonado } = appContext;

    useEffect(() => {
        traerAbonados(2);
        //10 para que traiga los de jujuy
        traerMunicipiosPorProvincia(10);
    },[]);

    const [MunicipioId, setMunicipioId] = useState(0);
    const [modalDarDeBaja, setModalDarDeBaja] = useState(false);
    const [modalRenovarContrato, setModalRenovarContrato] = useState(false);

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

    const handleChangeModalDarDeBaja = (data) => {
        setModalDarDeBaja(!modalDarDeBaja)
        if(!modalDarDeBaja){
            setAbonadoInfo({
                EstadoId: 3,
                UserId: data.UserId,
                deletedAt: new Date(),
                deletedBy: GetUserId()
            })
        }
        else {
            setAbonadoInfo({
                UserId: null
            })
        }
    }

    const handleChangeModalRenovarContrato = (data) => {
        setModalRenovarContrato(!modalRenovarContrato)
        if(!modalRenovarContrato){
            setAbonadoInfo({
                UserId: data.UserId,
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
        setMunicipioId(e.target.value);
        traerAbonados(2, e.target.value);
    }

    const styles = useStyles();
    const columnasAbonadosActivos = [
    {
        "name": "id",
        "selector": row =>row["UserId"],
        "omit": true,
    },
    {
        "name": "N°",
        "selector": row =>row["AbonadoNumero"],
        "width": '50px'
    },
    {
        "name": <TooltipForTable name="Nombre Completo" />,
        "selector": row => row["Apellido"] + ', ' + row["Nombre"],
        "wrap": true,
    },
    {
        "name": <TooltipForTable name="Domicilio" />,
        "selector": row => row["DomicilioCalle"] + ' ' + row["DomicilioNumero"] +  ", B° " + row["BarrioNombre"] + ' ' +  row["MunicipioNombre"],
        "wrap": true,
        "sortable": true
    },
    {
        "name": "N° teléfono",
        "selector": row =>row["Telefono"],
        "omit": true,
    },
    {
        "name": "DNI",
        "selector": row => formatDocumento(row["Documento"]),
        "hide": "sm"
    },
    {
        "name": <TooltipForTable name="Servicio" />,
        "selector": row => <SpanServicio servicioId={row["ServicioId"]} servicioNombre={row["ServicioNombre"]} onuMac={row["OnuMac"]}></SpanServicio>,
        "hide": "sm",
        "width": "300px"
    },
    { 
        "name": <TooltipForTable name="Vencimiento de Servicio" />,
        "selector": row => row["FechaVencimientoServicio"] ? <SpanVencimientoServicio timestamp={row["FechaVencimientoServicio"]}></SpanVencimientoServicio> : "",
    },
    {
        cell: (data) =>
        <BotonesDatatable botones={
            <>
            <MenuItem>
                <Link to={`/caratula-abonado/${data.AbonadoNumero}`} state={data} style={{textDecoration: 'none', color: "navy"}}>
                <Typography style={{color: 'navy'}}>
                <i className='bx bx-pencil bx-xs'></i> Editar</Typography>
                </Link> 
            </MenuItem>
            <MenuItem>
                <Link to={`/cambio-domicilio/${data.AbonadoNumero}`} state={data} style={{textDecoration: 'none', color: "navy"}}>
                <Typography style={{color: 'navy'}}>
                <i className='bx bx-home bx-xs'></i> Cambio de domicilio</Typography>
                </Link> 
            </MenuItem>
            <MenuItem>
                <Link to={`/cambio-servicio/${data.AbonadoNumero}`} state={data} style={{textDecoration: 'none', color: "navy"}}>
                <Typography style={{color: 'navy'}}>
                <i className='bx bx-plug bx-xs'></i> Cambio de servicio</Typography>
                </Link> 
            </MenuItem>
            <MenuItem>
                <Link to={`/cambio-titularidad/${data.AbonadoNumero}`} state={data} style={{textDecoration: 'none', color: "navy"}}>
                <Typography style={{color: 'navy'}}>
                <i className='bx bx-user bx-xs'></i> Cambio de titularidad</Typography>
                </Link> 
            </MenuItem>
            <MenuItem>
                <Link to={`/historial-de-pagos/${data.AbonadoNumero}`} state={data} style={{textDecoration: 'none', color: "navy"}}>
                <Typography style={{color: 'navy'}}>
                <i className='bx bx-money bx-xs'></i> Historial de pagos</Typography>
                </Link> 
            </MenuItem>
            {Date.parse(data.FechaVencimientoServicio) <= Date.parse(new Date()) ?
            <MenuItem>
                <Typography onClick={()=>handleChangeModalRenovarContrato(data)} style={{textDecoration: 'none', color: "navy", cursor: "pointer"}}><i className='bx bx-receipt bx-xs'></i> Renovar contrato</Typography>
            </MenuItem>
            : ""}
            <MenuItem>
                <Typography onClick={()=>handleChangeModalDarDeBaja(data)} style={{textDecoration: 'none', color: "red", cursor: "pointer"}}><i className='bx bx-user-x bx-xs'></i> Dar de baja</Typography>
            </MenuItem>
            </>
        }/>
    }
]
    const ExpandedComponent = ({ data }) =>
    <>
        <Typography style={{fontWeight: 'bold'}} variant="h6"><i className="bx bx-home"></i> Domicilio: {data.DomicilioCalle} {data.DomicilioNumero} | Barrio {data.BarrioNombre} | {data.MunicipioNombre}</Typography>
        <Typography style={{fontWeight: 'bold'}} variant="h6"><i className="bx bx-id-card"></i> DNI: {data.Documento}</Typography>
        <Typography style={{fontWeight: 'bold'}} variant="h6"><i className="bx bx-plug"></i> Servicio: {data.ServicioNombre}</Typography>
    </>;
    return (
        <>
        <div className="container">
        <Aside/>
        <main>
        <Typography variant="h6">Abonados Activos <Tooltip arrow title="Los abonados activos son aquellos a los cuáles se le realizó la instalación correspondiente">
            <i style={{color: 'blue'}} className="bx bxs-help-circle bx-tada-hover bx-sm"></i></Tooltip>
        </Typography>
        <br/>
        <Card>
            <CardContent>
                <br/>
                <Grid item xs={12} md={2} lg={2} xl={2}>
                    <TextField
                    onChange={handleChangeMunicipioSeleccionado}
                    value={MunicipioId}
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
                abrirModal={modalRenovarContrato}
                funcionCerrar={handleChangeModalRenovarContrato}
                titulo={<Typography variant="h2"><i className='bx bx-receipt bx-xs'></i> Renovar contrato de abonado</Typography>}
                botones={
                <>
                <Button onClick={()=>
                    {renovarContratoAbonado(AbonadoInfo)
                    setModalRenovarContrato(false)}}
                    variant="contained"
                    color="secondary">
                    Renovar contrato</Button>
                <Button onClick={handleChangeModalRenovarContrato}>Cancelar</Button></>}
                formulario={
                <>
                Al renovar el contrato del abonado, el mismo tendrá vigencia por 2 años, hasta el día: {new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toLocaleDateString()}
                </>}
                >
                </Modal>
                <Modal
                abrirModal={modalDarDeBaja}
                funcionCerrar={handleChangeModalDarDeBaja}
                titulo={<Alert severity="error" icon={<i className="bx bx-user-x bx-sm"></i>}>Si usted da de baja al abonado, pasará al listado de <b>Abonados Inactivos</b></Alert>}
                botones={
                <>
                <Button onClick={()=>
                    {cambiarEstadoAbonado(AbonadoInfo)
                    setModalDarDeBaja(false)}}
                    style={{backgroundColor: "#EF5350", color:"white"}}
                    variant="contained"
                    >
                Dar de baja</Button>
                <Button onClick={handleChangeModalDarDeBaja}>Cancelar</Button></>}
                formulario={
                <>
                <TextField
                className={styles.inputModal}
                autoFocus
                variant="outlined"
                name="CambioEstadoObservaciones"
                value={CambioEstadoObservaciones}
                fullWidth
                onChange={onChangeInputEstadoObservaciones}
                >
                </TextField>
                <FormHelperText>Ingrese motivo de baja</FormHelperText>
                </>}
                >
                </Modal>
                <br/>
                <span><i style={{color: 'red'}} class='bx bxs-circle'></i>Servicio Vencido </span>
                <span><i style={{color: 'green'}} class='bx bxs-circle'></i>Servicio Vigente</span>
                <Datatable
                    loader={true}
                    columnas={columnasAbonadosActivos}
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
 
export default ListaAbonadosActivos;