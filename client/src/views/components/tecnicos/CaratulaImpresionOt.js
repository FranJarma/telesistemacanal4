import { Checkbox, FormControl, FormControlLabel, Typography } from '@material-ui/core';
import React, { useContext, useEffect } from 'react';
import AppContext from '../../../context/appContext';
import olinet from '../../images/olinet.PNG';
import logo3 from '../../images/logo3.PNG';
import convertirAFecha from '../../../helpers/ConvertirAFecha';
import convertirAHora from '../../../helpers/ConvertirAHora';

const CaratulaImpresionOt = ({datos}) => {
    const appContext = useContext(AppContext);
    const { tareasOrdenDeTrabajo, tecnicosOrdenDeTrabajo, traerTareasOt, traerTecnicosOt } = appContext;
    useEffect(()=> {
        traerTareasOt(datos.OtId);
        traerTecnicosOt(datos.OtId);
    },[]);

    return (
        (datos ? 
        <>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <img src={logo3} alt="" style={{width: '6rem', height: '3rem'}}/>
            <Typography variant="h1">Orden de trabajo N° {datos.OtId}</Typography>
            <img src={olinet} alt="" style={{width: '6rem', height: '3rem'}}/>
        </div>
        <br/>
        <Typography variant="h6"><b>Responsable de emisión: </b>{datos.ApellidoResponsableCreacion} {datos.NombreResponsableCreacion}</Typography>
            <hr/>
            <br/>
            <Typography variant="h6"><b>Responsable/s de ejecución: </b> {tecnicosOrdenDeTrabajo.map(tecnico=>(tecnico.NombreTecnico + " " + tecnico.ApellidoTecnico + " - "))}</Typography>
            <hr/>
            <br/>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <Typography variant="h6"><b>Fecha de emisión OT:</b> {convertirAFecha(datos.createdAt)}</Typography>
                <Typography variant="h6"><b>Hora: </b>{convertirAHora(datos.createdAt)}</Typography>
            </div>
            <hr/>
            <br/>
            <Typography variant="h6"><b>Abonado: </b> {datos.ApellidoAbonado} {datos.NombreAbonado}</Typography>
            <hr/>
            <br/>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <Typography variant="h6"><b>Localidad:</b> {datos.MunicipioNombre}</Typography>
                <Typography variant="h6"><b>Barrio: </b> {datos.BarrioNombre}</Typography>
            </div>
            <hr/>
            <br/>
            <Typography variant="h6"><b>Domicilio:</b> {datos.DomicilioCalle} {datos.DomicilioNumero}</Typography>
            <hr/>
            <br/>
            <Typography variant="h6"><b>Tareas a realizar:</b> {tareasOrdenDeTrabajo.map(tarea=>(tarea.TareaNombre + "($"+tarea.TareaPrecioUnitario+") - "))}</Typography>
            <hr/>
            <br/>
            <Typography variant="h6"><b>Observaciones:</b> {datos.OtObservacionesResponsableEmision}</Typography>
            <hr/>
            <br/>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <Typography variant="h6"><b>1era visita:</b>{datos.OtPrimeraVisita ? convertirAFecha(datos.OtPrimeraVisita) : ""}</Typography>
            <Typography variant="h6"><b>2da visita:</b>{datos.OtSegundaVisita ? convertirAFecha(datos.OtSegundaVisita) : ""}</Typography>
            <Typography variant="h6"><b>3era visita:</b>{datos.OtTerceraVisita ? convertirAFecha(datos.OtTerceraVisita) : ""}</Typography>
            <br/>
            <br/>
            </div>
            <Typography variant="h6"><b>Fecha de realización:</b>{datos.OtFechaFinalizacion ? convertirAFecha(datos.OtFechaFinalizacion) : ""}</Typography>
            <hr/>
            <br/>
            <Typography variant="h6"><b>Hora de inicio:</b>{datos.OtFechaInicio ? convertirAFecha(datos.OtFechaInicio) : ""}</Typography>
            <hr/>
            <br/>
            <Typography variant="h6"><b>Hora de finalización:</b>{datos.OtFechaFinalizacion ? convertirAFecha(datos.OtFechaFinalizacion) : ""}</Typography>
            <hr/>
            <br/>
            <FormControl>
                    <FormControlLabel label="Se verificó señal" control={<Checkbox></Checkbox>}></FormControlLabel>
            </FormControl>
            <Typography variant="h6"><b>Observaciones:</b>{datos.OtObservacionesResponsableEjecucion !== "" ? datos.OtObservacionesResponsableEjecucion : ""}
            </Typography>
            <br/>
            <br/>
            <br/>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <Typography variant="h6"><b>Firma responsable de ejecución</b></Typography>
            <Typography variant="h6"><b>Conformidad del abonado</b></Typography>
            </div>
        </>
        : "" )
    );
}
 
export default CaratulaImpresionOt;