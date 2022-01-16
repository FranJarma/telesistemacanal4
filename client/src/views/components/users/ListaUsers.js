import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../../../context/appContext';
import Aside from '../design/layout/Aside';
import Footer from '../design/layout/Footer';
import './../design/layout/styles/styles.css';
import { Button, Card, CardContent, CardHeader, MenuItem, Tooltip, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import Datatable from '../design/components/Datatable';
import Modal from '../design/components/Modal';
import { Link } from 'react-router-dom';
import BotonesDatatable from '../design/components/BotonesDatatable';

const Users = () => {
    const appContext = useContext(AppContext);
    const { usuarios, traerUsuarios, eliminarUsuario } = appContext;

    useEffect(() => {
        traerUsuarios(2);
    },[]);

    const [modalDarDeBaja, setModalDarDeBaja] = useState(false);

    const [UserInfo, setUserInfo] = useState({
        UserId: null,
        EstadoId: null,
        CambioEstadoFecha: null,
        CambioEstadoObservaciones: null
    });

    const handleChangeModalDarDeBaja = (data) => {
        setModalDarDeBaja(!modalDarDeBaja)
        if(!modalDarDeBaja){
            setUserInfo({
                EstadoId: 3,
                CambioEstadoFecha: new Date().toJSON(),
                CambioEstadoObservaciones: 'Usuario dado de baja',
                UserId: data.UserId
            })
        }
        else {
            setUserInfo({
                UserId: null
            })
        }
    }

    const columnasUsers = [
    {
        "name": "id",
        "selector": row =>row["UserId"],
        "omit": true,
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
        "selector": row => row["Documento"],
        "wrap": true,
        "sortable": true
    },
    {
        "name": "Nombre de Usuario",
        "selector": row => row["NombreUsuario"],
        "wrap": true,
        "sortable": true
    },
    {
        "name": "Email",
        "selector": row =>row["Email"],
        "wrap": true,
        "sortable": true
    },
    {
        "name": "Estado",
        "selector": row =>row["EstadoNombre"],
        "wrap": true,
        "sortable": true
    },
    {
        cell: (data) =>
        <>
        <BotonesDatatable botones={
            <>
            <MenuItem>
                <Link to={{
                pathname: `/caratula-user/edit/UserId=${data.UserId}`,
                state: data
                }}
                style={{textDecoration: 'none', color: "teal"}}>
                <Typography ><i className='bx bxs-pencil bx-xs' ></i> Editar</Typography>
                </Link>
            </MenuItem>
            <MenuItem>
                <Typography onClick={()=>handleChangeModalDarDeBaja(data)} style={{textDecoration: 'none', color: "red", cursor: "pointer"}}><i className='bx bx-trash bx-xs'></i> Eliminar</Typography>
            </MenuItem>
            </>
        }/>
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
            action={<Link style={{textDecoration: 'none'}} to="/caratula-user"><Button variant="contained" color="primary">+ Nuevo usuario</Button></Link>}>
            </CardHeader>
            <CardContent>
                <Typography variant="h1">Listado de usuarios del sistema</Typography>
                <br/>
                <Modal
                abrirModal={modalDarDeBaja}
                funcionCerrar={handleChangeModalDarDeBaja}
                titulo={<Alert severity="error" icon={<i className="bx bxs-user-x bx-sm"></i>}>¿Está seguro que quiere dar de baja al usuario?</Alert>}
                botones={
                <>
                <Button onClick={()=>
                    {eliminarUsuario(UserInfo)
                    setModalDarDeBaja(false)}}
                    variant="contained"
                    color="secondary">
                    Aceptar</Button>
                <Button onClick={handleChangeModalDarDeBaja}>Cerrar</Button></>}
                >
                </Modal>
                <Datatable
                    loader={true}
                    columnas={columnasUsers}
                    datos={usuarios}
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
 
export default Users;