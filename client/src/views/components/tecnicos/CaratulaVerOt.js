import { Checkbox, FormControl, FormControlLabel, Typography } from '@material-ui/core';
import React, { useContext, useEffect } from 'react';
import AppContext from '../../../context/appContext';
import olinet from '../../images/olinet.PNG';
import logo3 from '../../images/logo3.PNG';

const CaratulaVerOt = ({datos}) => {
    const appContext = useContext(AppContext);
    const { tareasOrdenDeTrabajo, tecnicosOrdenDeTrabajo, traerTareasOt, traerTecnicosOt } = appContext;
    useEffect(()=> {
        traerTareasOt(datos.OtId);
        traerTecnicosOt(datos.OtId);
    },[]);

    return (
        (datos ? 
        <>
        <br/>
            <Typography variant="h6"><b>Responsable/s de ejecución: </b> {tecnicosOrdenDeTrabajo.map(tecnico=>(tecnico.NombreTecnico + " " + tecnico.ApellidoTecnico + " - "))}</Typography>
            <hr/>
            <br/>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <Typography variant="h6"><b>Fecha de emisión OT:</b> {datos.createdAt.split('T')[0]}</Typography>
                <Typography variant="h6"><b>Hora: </b>{datos.createdAt.split('T')[1].split('.')[0]}</Typography>
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
        </>
        : "" )
    );
}
 
export default CaratulaVerOt;