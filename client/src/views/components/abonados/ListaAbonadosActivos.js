import React from 'react';
import { Button, Card, CardContent, CardHeader, Tooltip, Typography } from '@material-ui/core';
import Datatable from '../design/components/Datatable';
import {abonadosActivos} from './DatosTabla';
import {columnasAbonadosActivos} from './ColumnasTabla';
import useStyles from './../Styles';
import Aside from '../design/layout/Aside';
import { Link } from 'react-router-dom';
import Footer from '../design/layout/Footer';

const ListaAbonadosActivos = () => {
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
                    datos={abonadosActivos}
                />
            </CardContent>
        </Card>
        </>
    );
}
 
export default ListaAbonadosActivos;