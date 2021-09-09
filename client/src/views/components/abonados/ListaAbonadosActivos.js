import React, { useEffect, useContext, useState } from 'react';
import { Button, Card, CardContent, CardHeader, Grid, MenuItem, TextField, Typography } from '@material-ui/core';
import Datatable from '../design/components/Datatable';
import {columnasAbonadosActivos} from './ColumnasTabla';
import useStyles from '../Styles';
import Aside from '../design/layout/Aside';
import { Link } from 'react-router-dom';
import AbonadoContext from '../../../context/abonados/abonadoContext';
import MunicipioContext from '../../../context/municipios/municipioContext';

const ListaAbonadosActivos = () => {
    const abonadosContext = useContext(AbonadoContext);
    const municipiosContext = useContext(MunicipioContext);

    const { abonados, traerAbonadosActivos } = abonadosContext;
    const { municipios, traerMunicipiosPorProvincia } = municipiosContext;

    useEffect(() => {
        traerAbonadosActivos();
        //10 para que traiga los de jujuy
        traerMunicipiosPorProvincia(10);
    },[]);

    const [municipioSeleccionadoId, setMunicipioSeleccionadoId] = useState(0);
    const handleChangeMunicipioSeleccionado = (e) => {
        setMunicipioSeleccionadoId(e.target.value);
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
                <br/>
                <Grid item xs={12} md={4} lg={4} xl={4}>
                    <TextField
                    onChange={handleChangeMunicipioSeleccionado}
                    value={municipioSeleccionadoId}
                    label="Municipio"
                    fullWidth
                    select
                    >
                    {municipios.length > 0 ? municipios.map((municipio)=>(
                        <MenuItem key={municipio.MunicipioId} value={municipio.MunicipioId}>{municipio.MunicipioNombre}</MenuItem>
                    )): <MenuItem disabled>No se encontraron municipios</MenuItem>}
                    </TextField>
                </Grid>
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