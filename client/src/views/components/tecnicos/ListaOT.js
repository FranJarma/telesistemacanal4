import React, { useState, useContext, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, Tooltip, Typography } from '@material-ui/core';
import Datatable from '../design/components/Datatable';
import Aside from '../design/layout/Aside';
import Footer from '../design/layout/Footer';
import Modal from '../design/components/Modal';
import AppContext from '../../../context/appContext';
import { Link } from 'react-router-dom';
import CaratulaImpresionOt from './CaratulaImpresionOt';

const ListaOT = () => {
    const appContext = useContext(AppContext);
    const { ordenesDeTrabajo, traerOrdenesDeTrabajo, traerTareasOt } = appContext;

    useEffect(()=>{
        traerOrdenesDeTrabajo();
    },[])

    const [ModalImprimirOt, setModalImprimirOt] = useState(false);
    const [ModalEliminarTarea, setModalEliminarTarea] = useState(false);
    const [OtInfoImpresion, setOtInfoImpresion] = useState({})

    const handleChangeModalImprimirOt = (data = '') => {
        if(!ModalImprimirOt) {
            setOtInfoImpresion(data);
            setModalImprimirOt(true);
        }
        else {
            setOtInfoImpresion('');
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
            "name": "Fecha prevista de visita",
            "wrap": true,
            "selector": row => row["OtFechaPrevistaVisita"].split('T')[0].split('-').reverse().join('/'),
        },
        {
            "name": "Observaciones",
            "wrap": true,
            "selector": row => row["OtObservacionesResponsableEmision"] ? row["OtObservacionesResponsableEmision"] : "-",
        },        
        {
            cell: (data) => 
            <>
            <Typography style={{color: "teal", cursor: 'pointer'}}><Tooltip title="Editar"><i className='bx bxs-pencil bx-xs' ></i></Tooltip></Typography>
            <Typography style={{color: "navy", cursor: 'pointer'}}><Tooltip title="Registrar visita"><i className='bx bxs-calendar bx-xs' ></i></Tooltip></Typography>
            <Typography style={{color: "navy", cursor: 'pointer'}}><Tooltip title="Finalizar OT"><i className='bx bx-calendar-check bx-xs' ></i></Tooltip></Typography>
            <Typography onClick={()=>{handleChangeModalImprimirOt(data)}} style={{color: "orange", cursor: 'pointer'}}><Tooltip title="Imprimir"><i className="bx bx-printer bx-xs"></i></Tooltip></Typography>
            <Typography style={{color: "red", cursor: 'pointer'}}><Tooltip title="Eliminar"><i className="bx bx-trash bx-xs"></i></Tooltip></Typography>
            </>,
        }
    ]
    return (
        <>
        <div className="container">
        <Aside/>
        <main>
        <Card>
            <CardHeader action={<Link style={{textDecoration: 'none'}} to="/caratula-ot"><Button variant="contained" color="primary">+ Nueva OT</Button></Link>}></CardHeader>
            <CardContent>
                <Typography variant="h1">Listado de Órdenes de Trabajo</Typography>
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
            formulario={<CaratulaImpresionOt datos={OtInfoImpresion}/>}
            ></Modal>
        </main>
        <Footer/>
        </div>
        </>
    );
}
 
export default ListaOT;