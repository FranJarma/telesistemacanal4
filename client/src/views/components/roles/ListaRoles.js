import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../../../context/appContext';
import Aside from '../design/layout/Aside';
import Footer from '../design/layout/Footer';
import './../design/layout/styles/styles.css';
import { Button, Card, CardContent, CardHeader, Tooltip, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import Datatable from '../design/components/Datatable';
import Modal from '../design/components/Modal';
import { Link } from 'react-router-dom';

const Roles = () => {
    const appContext = useContext(AppContext);
    const { roles, traerRoles, eliminarRol } = appContext;

    useEffect(() => {
        traerRoles(2);
    },[]);

    const [modalDarDeBaja, setModalDarDeBaja] = useState(false);

    const [RoleInfo, setRoleInfo] = useState({
        RoleId: null,
        RoleName: null,
        RoleDescription: null
    });

    const handleChangeModalDarDeBaja = (data) => {
        setModalDarDeBaja(!modalDarDeBaja)
        if(!modalDarDeBaja){
            setRoleInfo({
                EstadoId: 3,
                CambioEstadoFecha: new Date().toJSON(),
                RoleId: data.RoleId
            })
        }
        else {
            setRoleInfo({
                RoleId: null
            })
        }
    }

    const columnasRoles = [
    {
        "name": "id",
        "selector": row =>row["RoleId"],
        "omit": true,
    },
    {
        "name": "Nombre",
        "selector": row =>row["RoleName"],
        "wrap": true
    },
    {
        "name": "Descripción",
        "selector": row =>row["RoleDescription"],
        "wrap": true
    },
    {
        cell: (data) =>
        <>
        <Link to={{
            pathname: `/caratula-role/edit/RoleId=${data.RoleId}`,
            state: data
        }}
        style={{textDecoration: 'none', color: "teal"}}>
        <Tooltip title="Editar"><i className='bx bxs-pencil bx-xs' ></i></Tooltip>
        </Link>
        <Typography onClick={()=>handleChangeModalDarDeBaja(data)} style={{textDecoration: 'none', color: "red", cursor: "pointer"}}><Tooltip title="Dar de baja"><i className='bx bxs-user-x bx-xs'></i></Tooltip></Typography>
        </>,
    }
]
    return (
        <>
        <div className="container">
        <Aside/>
        <main>
        <Card>
            <CardHeader
            action={<Link style={{textDecoration: 'none'}} to="/caratula-role"><Button variant="contained" color="primary">+ Nuevo rol</Button></Link>}>
            </CardHeader>
            <CardContent>
                <Typography variant="h1">Listado de roles del sistema</Typography>
                <br/>
                <Modal
                abrirModal={modalDarDeBaja}
                funcionCerrar={handleChangeModalDarDeBaja}
                titulo={<Alert severity="error" icon={<i className="bx bxs-user-x bx-sm"></i>}>¿Está seguro que quiere dar de baja el rol?</Alert>}
                botones={
                <>
                <Button onClick={()=>
                    {eliminarRol(RoleInfo)
                    setModalDarDeBaja(false)}}
                    variant="contained"
                    color="secondary">
                    Aceptar</Button>
                <Button onClick={handleChangeModalDarDeBaja}>Cerrar</Button></>}
                >
                </Modal>
                <Datatable
                    loader={true}
                    columnas={columnasRoles}
                    datos={roles}
                    paginacion={true}
                    buscar={true}>
                </Datatable>
            </CardContent>
        </Card>
        </main>
        <Footer/>
        </div>
        </>
    );
}
 
export default Roles;