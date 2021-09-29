import React from 'react';
import { Button, Card, CardHeader, CardContent, Typography } from '@material-ui/core';
import Datatable from '../design/components/Datatable';
import {pagos} from './DatosTabla';
import {columnasPagos} from './ColumnasTabla';
import useStyles from './../Styles';
import Aside from '../design/layout/Aside';
import { useLocation } from 'react-router';
import Footer from '../design/layout/Footer';
import BreadCrumb from '../design/components/Breadcrumb';

const ListaPagos = () => {
    const styles = useStyles();
    const location = useLocation();
    let saldo = 0;
    const saldos = pagos.map((item)=>(
        item.saldo !== 0  ? saldo = saldo + item.total : ""
    ))
    return (
        <>
        <div className="container">
        <Aside></Aside>
        <main>
        <Card className={styles.cartaPrincipal}>
            <CardContent>
                <Typography variant="h1">Historial de pagos de: {location.state.FullName}</Typography>
                <Typography variant="h2">Saldo acumulado al día {new Date().toLocaleDateString()}: $ {saldo}
                </Typography>
                <Datatable
                    columnas={columnasPagos}
                    datos={pagos}
                />
            </CardContent>
        </Card>
        </main>
        <Footer/>
        </div>
        </>
    );
}
 
export default ListaPagos;