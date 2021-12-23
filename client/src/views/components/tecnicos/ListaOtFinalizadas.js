import React, { useState, useContext, useEffect } from 'react';
import { Card, CardContent, Tooltip, Typography } from '@material-ui/core';
import Datatable from '../design/components/Datatable';
import Aside from '../design/layout/Aside';
import Footer from '../design/layout/Footer';
import Modal from '../design/components/Modal';
import AppContext from '../../../context/appContext';
import { Link } from 'react-router-dom';
import CaratulaImpresionOt from './CaratulaImpresionOt';

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
            "name": "id",
            "selector": row => row["OtId"],
            "omit": true
        },
        {
            "name": "Abonado",
            "wrap": true,
            "selector": row => row["ApellidoAbonado"] + ", " + row["NombreAbonado"]
        },
        {
            "name": "Domicilio",
            "wrap": true,
            "selector": row => row["DomicilioCalle"] + " " + row["DomicilioNumero"]
        },
        {
            "name": "Monto",
            "wrap": true,
            "selector": row => "$ " + row["Monto"]
        },
        {
            "name": "Fecha y hora de inicio",
            "wrap": true,
            "selector": row => row["OtFechaInicio"].split('T')[0].split('-').reverse().join('/') + "-" + row["OtFechaInicio"].split('T')[1].split('.')[0]
        },
        {
            "name": "Fecha y hora de finalización",
            "wrap": true,
            "selector": row => row["OtFechaFinalizacion"].split('T')[0].split('-').reverse().join('/') + "-" + row["OtFechaFinalizacion"].split('T')[1].split('.')[0]
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