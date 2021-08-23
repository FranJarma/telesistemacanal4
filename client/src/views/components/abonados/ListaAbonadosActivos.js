import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, Typography } from '@material-ui/core';
import Datatable from '../design/components/Datatable';
import {columnasAbonadosActivos} from './ColumnasTabla';
import {abonadosActivos} from './DatosTabla';
import useStyles from './../Styles';
import Aside from '../design/layout/Aside';
import { Link } from 'react-router-dom';
import clienteAxios from './../../../config/axios';

const ListaAbonadosActivos = () => {
    const [abonados, setAbonados] = useState([]);
    useEffect(() => {
        traerAbonados();
    },[])

    async function traerAbonados () {
        const datosAbonadosAPI = await clienteAxios.get('/api/abonados');
        console.log(datosAbonadosAPI.data)
        console.log(abonadosActivos)
        setAbonados(datosAbonadosAPI.data);
    }
    const styles = useStyles();
    return (
        <>
        <Aside/>
        <Card className={styles.cartaPrincipal}>
            <CardHeader
            action={<Link style={{textDecoration: 'none'}} to="/caratula-abonado"><Button variant="contained" color="primary">+ Nuevo Abonado</Button></Link>}>
            </CardHeader>
            <CardContent>
                <Typography variant="h1">Abonados Activos</Typography>
                <Datatable
                    columnas={columnasAbonadosActivos}
                    datos={abonados}
                />
            </CardContent>
        </Card>
        </>
    );
}
 
export default ListaAbonadosActivos;