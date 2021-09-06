import React, { useEffect, useContext } from 'react';
import { Button, Card, CardContent, CardHeader, Typography } from '@material-ui/core';
import Datatable from '../design/components/Datatable';
import {columnasAbonadosActivos} from './ColumnasTabla';
import useStyles from './../Styles';
import Aside from '../design/layout/Aside';
import { Link } from 'react-router-dom';
import AbonadoContext from '../../../context/abonados/abonadoContext';

const ListaAbonadosActivos = () => {
    const abonadosContext = useContext(AbonadoContext);
    const { abonados, traerAbonadosActivos } = abonadosContext;
    useEffect(() => {
        traerAbonadosActivos();
    },[]);
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