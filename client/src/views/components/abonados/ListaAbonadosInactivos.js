import React from 'react';
import { Button, Card, CardContent, CardHeader, Typography } from '@material-ui/core';
import Datatable from '../design/components/Datatable';
import {abonadosInactivos} from './DatosTabla';
import {columnasAbonadosInactivos} from './ColumnasTabla';
import useStyles from './../Styles';
import Aside from '../design/layout/Aside';
import { Link } from 'react-router-dom';

const ListaAbonadosInactivos = () => {
    const styles = useStyles();
    return (
        <>
        <Aside/>
        <Card className={styles.cartaPrincipal}>
            <CardContent>
                <Typography variant="h1">Abonados Inactivos</Typography>
                <Datatable
                    columnas={columnasAbonadosInactivos}
                    datos={abonadosInactivos}
                />
            </CardContent>
        </Card>
        </>
    );
}
 
export default ListaAbonadosInactivos;