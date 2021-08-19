import React from 'react';
import { Card, Button, CardContent, CardHeader, Typography } from '@material-ui/core';
import Datatable from '../design/components/Datatable';
import {detallesPagos} from './DatosTabla';
import {columnasDetallesPagos} from './ColumnasTabla';
import useStyles from '../Styles';
import Aside from '../design/layout/Aside';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';

const ListaDetallesPagos = () => {
    const styles = useStyles();
    const location = useLocation();

    return (
        <>
            <Aside/>
            <Card className={styles.cartaPrincipal}>
                <CardContent>
                    <CardHeader
                    action={<Link style={{textDecoration: 'none'}} to="/caratula-detalle-pago"><Button variant="contained" color="primary">+ Nuevo Pago</Button></Link>}>
                    </CardHeader>
                    <Typography variant="h1">Detalles de pago</Typography>
                    <Typography variant="h2">Período: {location.state.mes} de {location.state.año}</Typography>
                    <Datatable
                        columnas={columnasDetallesPagos}
                        datos={detallesPagos}
                    />
                </CardContent>
            </Card>
        </>
    );
}
 
export default ListaDetallesPagos;