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
import BotonesDatatable from '../design/components/BotonesDatatable';
import TooltipForTable from '../../../helpers/TooltipForTable';
import convertirAFecha from '../../../helpers/ConvertirAFecha';
import generarRecibo from '../../../helpers/GenerarRecibo';

const ListaAbonadosInscriptos = () => {
    const appContext = useContext(AppContext);
    const { abonados, municipios, inscripcion, traerAbonados, traerMunicipiosPorProvincia, cambiarEstadoAbonado, traerDatosInscripcion } = appContext;

    useEffect(() => {
        traerAbonados(1);
        //10 para que traiga los de jujuy
        traerMunicipiosPorProvincia(10);
    },[]);

    const [MunicipioId, setMunicipioId] = useState(0);
    const [modalDatosInscripcion, setModalDatosInscripcion] = useState(false);
    const [modalDarDeBaja, setModalDarDeBaja] = useState(false);
    const [modalConfirmarInstalacion, setModalConfirmarInstalacion] = useState(false);

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
                UserId: data.UserId
            })
        }
        else {
            setAbonadoInfo({
                UserId: null
            })
        }
    }

    const handleChangeModalConfirmarInstalacion = (data) => {
        setModalConfirmarInstalacion(!modalConfirmarInstalacion)
        if(!modalConfirmarInstalacion){
            setAbonadoInfo({
                EstadoId: 2,
                CambioEstadoFecha: new Date().toJSON(),
                UserId: data.UserId
            })
        }
        else {
            setAbonadoInfo({
                UserId: null
            })
        }
    }

    const handleChangeModalDatosInscripcion = (data) => {
        setModalDatosInscripcion(!modalDatosInscripcion)
        if(!modalDarDeBaja){
            traerDatosInscripcion(data.UserId);
            setAbonadoInfo({
                EstadoId: 3,
                UserId: data.UserId
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
        traerAbonados(1, e.target.value);
    }

    const styles = useStyles();

    const columnasAbonadosInscriptos = [
    {
        "name": "id",
        "selector": row =>row["UserId"],
        "omit": true,
    },
    {
        "name": <TooltipForTable name="Nombre Completo" />,
        "selector": row => row["Apellido"] + ', ' + row["Nombre"],
        "wrap": true,
        "sortable": true,
    },
    {
        "name": <TooltipForTable name="Domicilio Completo" />,
        "selector": row => row["DomicilioCalle"] + ', ' + row["DomicilioNumero"] + ' | ' +  "Barrio " + row["BarrioNombre"] + ' | ' +  row["MunicipioNombre"],
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
        "name": "Servicio",
        "selector": row =>row["ServicioNombre"],
        "sortable": true,
        "hide": "sm",
    },
    {
        "name": <TooltipForTable name="Fecha de Bajada" />,
        "selector": row => convertirAFecha(row["FechaBajada"]),
        "sortable": true
    },
    {
        "name": <TooltipForTable name="Fecha de Contrato" />,
        "selector": row => convertirAFecha(row["FechaContrato"]),
        "sortable": true
    },
    {
        cell: (data) =>
        <BotonesDatatable botones={
            <>
            <MenuItem>
                <Link to={{
                pathname: `/caratula-abonado/edit/${data.Nombre + "-" +  data.Apellido}`,
                state: data
                }} style={{textDecoration: 'none', color: "teal"}}>
                <Typography style={{color: 'teal'}}>
                <i className='bx bxs-pencil bx-xs'></i> Editar</Typography>
                </Link>
            </MenuItem>
            <MenuItem>
                <Typography onClick={()=>handleChangeModalDatosInscripcion(data)} style={{textDecoration: 'none', color: 'navy', cursor: "pointer"}}><i className='bx bx-money bx-xs'></i> Inscripción</Typography>
            </MenuItem>
            <MenuItem>
                <Typography onClick={()=>handleChangeModalDarDeBaja(data)} style={{textDecoration: 'none', color: 'red', cursor: "pointer"}}><i className='bx bxs-user-x bx-xs'></i> Dar de baja</Typography>
            </MenuItem>
            </>
        }/>
    }
]
const columnasInscripcion = [
    {
        "name": "N°",
        "selector": row =>row["DetallePagoId"],
        "omit": true
    },
    {
        "name": "Dinero recibido",
        "selector": row =>"$" + row["DetallePagoMonto"],
        "sortable": true,
        "wrap": true
    },
    {
        "name": "Fecha de registro ",
        "selector": row => convertirAFecha(row["createdAt"]),
        "wrap": true,
        "sortable": true,
    },
    {
        "name": "Registrado por ",
        "selector": row =>row["Nombre"] + ', ' + row["Apellido"],
        "wrap": true,
        "sortable": true,
    },
    {
        "name": "Forma de pago",
        "selector": row => row["MedioPagoNombre"],
        "wrap": true,
        "sortable": true,
    },
    {
        cell: (data) =>
        <Tooltip title="Generar Recibo">
        <Typography onClick={() => generarRecibo(data)} style={{color: 'grey'}}>
        <i className='bx bxs-file bx-xs'></i>
        </Typography>
        </Tooltip>
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
        <Card>
            <CardHeader
            action={<Link style={{textDecoration: 'none'}} to="/caratula-abonado"><Button startIcon={<i className="bx bx-plus"></i>} variant="contained" color="primary"> Inscribir abonado</Button></Link>}>
            </CardHeader>
            <CardContent>
                <Typography variant="h1">Abonados Inscriptos <Tooltip arrow title="Los abonados inscriptos son aquellos que fueron dados de alta pero no se les realizó la instalación correspondiente">
                    <i style={{color: 'blue'}} className="bx bxs-help-circle bx-tada-hover bx-sm"></i></Tooltip>
                </Typography>
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
                abrirModal={modalDarDeBaja}
                funcionCerrar={handleChangeModalDarDeBaja}
                titulo={<Alert severity="error" icon={<i className="bx bxs-user-x bx-sm"></i>}>Si usted da de baja al abonado, pasará al listado de <b>Abonados Inactivos</b></Alert>}
                botones={
                <>
                <Button onClick={()=>
                    {cambiarEstadoAbonado(AbonadoInfo)
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
                <Modal
                abrirModal={modalConfirmarInstalacion}
                funcionCerrar={handleChangeModalConfirmarInstalacion}
                titulo={<Alert severity="info" icon={<i className="bx bxs-user-check bx-sm"></i>}>Si confirma la instalación, el abonado pasará al listado de <b>Abonados Activos</b></Alert>}
                botones={
                <>
                <Button onClick={()=>
                    {cambiarEstadoAbonado(AbonadoInfo)
                    setModalDarDeBaja(false)}}
                    variant="contained"
                    color="primary">
                    Aceptar</Button>
                <Button onClick={handleChangeModalConfirmarInstalacion}>Cerrar</Button></>}
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
                <FormHelperText>Observaciones</FormHelperText>
                </>}
                >
                </Modal>
                <Modal
                abrirModal={modalDatosInscripcion}
                funcionCerrar={handleChangeModalDatosInscripcion}
                titulo={<Alert severity="success" icon={<i className="bx bx-money bx-sm"></i>}>Datos de la inscripción</Alert>}
                formulario={
                <>
                <Datatable
                datos={inscripcion}
                columnas={columnasInscripcion}></Datatable>
                { inscripcion.length > 0 ?
                <>
                <Typography variant="h2"><b>Precio total de inscripción:</b> ${inscripcion[0].PagoTotal}</Typography>
                <Typography variant="h2"><b>Saldo restante:</b> ${inscripcion[0].PagoSaldo}</Typography>
                <Typography variant="h2"><b>Cuotas restantes:</b> {inscripcion[0].MedioPagoCantidadCuotas - inscripcion.length}</Typography>
                {inscripcion[0].MedioPagoCantidadCuotas - inscripcion.length > 0 ?
                <Button variant="contained" color="primary">Agregar cuota</Button> : ""}
                </>
                : "" }
                </>}
                >
                </Modal>
                <Datatable
                    loader={true}
                    columnas={columnasAbonadosInscriptos}
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
 
export default ListaAbonadosInscriptos;