import React, { useState, useContext, useEffect } from 'react';
import { Card, CardContent, Tooltip, Typography } from '@material-ui/core';
import Datatable from '../design/components/Datatable';
import Aside from '../design/layout/Aside';
import Footer from '../design/layout/Footer';
import Modal from '../design/components/Modal';
import AppContext from '../../../context/appContext';
import CaratulaImpresionOt from './CaratulaImpresionOt';
import convertirAFecha from './../../../helpers/ConvertirAFecha';
import convertirAHora from './../../../helpers/ConvertirAHora';
import TooltipForTable from './../../../helpers/TooltipForTable';

const ListaOtFinalizadas = () => {
    const appContext = useContext(AppContext);
    const { ordenesDeTrabajo, traerOrdenesDeTrabajo,} = appContext;

    useEffect(()=>{
        traerOrdenesDeTrabajo(6);
    },[])

    const [ModalImprimirOt, setModalImprimirOt] = useState(false);

    const [OtInfo, setOtInfo] = useState({})

    const handleChangeModalImprimirOt = (data = '') => {
        if(!ModalImprimirOt) {
            setOtInfo(data);
            setModalImprimirOt(true);
        }
        else {
            setOtInfo('');
            setModalImprimirOt(false);
        }
    }

    const columnasOt = [
        {
            "name": "N°",
            "selector": row => row["OtId"],
            "width": "70px"
        },
        {
            "name": "Abonado",
            "wrap": true,
            "sortable": true,
            "selector": row => row["ApellidoAbonado"] + ", " + row["NombreAbonado"]
        },
        {
            "name": "Domicilio",
            "wrap": true,
            "sortable": true,
            "selector": row => row["DomicilioCalle"] + ', ' + row["DomicilioNumero"] + ' | ' +  "Barrio " + row["BarrioNombre"] + ' | ' +  row["MunicipioNombre"],
        },
        {
            "name": <TooltipForTable name ="Fecha y hora de inicio"/> ,
            "wrap": true,
            "sortable": true,
            "selector": row => row["OtFechaInicio"] ? convertirAFecha(row["OtFechaInicio"]) + "-" + convertirAHora(row["OtFechaInicio"]) : ""
        },
        {
            "name": <TooltipForTable name ="Fecha y hora de finalización"/>,
            "wrap": true,
            "sortable": true,
            "selector": row => row["OtFechaFinalizacion"] ? convertirAFecha(row["OtFechaFinalizacion"]) + "-" + convertirAHora(row["OtFechaFinalizacion"]) : ""
        },
        {
            "name": <TooltipForTable name="Técnico a cargo"/>,
            "wrap": true,
            "sortable": true,
            "selector": row => row["ApellidoResponsableEjecucion"] + ", " + row["NombreResponsableEjecucion"]
        },
        {
            cell: (data) => 
            <>
            <Typography onClick={()=>{handleChangeModalImprimirOt(data)}} style={{color: "orange", cursor: 'pointer'}}><Tooltip title="Imprimir"><i className="bx bx-printer bx-xs"></i></Tooltip></Typography>
            </>,
        }
    ]
    return (
        <>
        <div className="container">
        <Aside/>
        <main>
        <Card>
            <CardContent>
                <Typography variant="h1">Listado de Órdenes de Trabajo finalizadas</Typography>
                <Datatable
                    loader={true}
                    datos={ordenesDeTrabajo}
                    columnas={columnasOt}
                    paginacion={true}
                    buscar={true}
                />
            </CardContent>
        </Card>
            <Modal
            abrirModal={ModalImprimirOt}
            funcionCerrar={handleChangeModalImprimirOt}
            formulario={<CaratulaImpresionOt datos={OtInfo}/>}
            ></Modal>
        </main>
        <Footer/>
        </div>
        </>
    );
}
 
export default ListaOtFinalizadas;