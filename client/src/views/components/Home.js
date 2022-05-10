import { Card, CardContent, Grid, Typography } from '@material-ui/core';
import React, { useContext, useEffect } from 'react';
import Aside from './design/layout/Aside';
import Footer from './design/layout/Footer';
import useStyles from './Styles';
import { Link } from 'react-router-dom';
import AppContext from '../../context/appContext';
import {CartesianGrid, BarChart, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer} from 'recharts';
import encontrarCoincidencias from '../../helpers/EncontrarCoincidencias';

const Home = () => {
    const styles = useStyles();
    const appContext = useContext(AppContext);
    const {traerMovimientosPorFecha, movimientos, ordenesDeTrabajo, traerOrdenesDeTrabajo, traerAbonados, abonados, traerBarriosPorMunicipio, barrios} = appContext;
    
    let cantidadOrdenesDeTrabajo = encontrarCoincidencias(ordenesDeTrabajo, "OtResponsableEjecucion", "NombreResponsableEjecucion", "ApellidoResponsableEjecucion");

    console.log(cantidadOrdenesDeTrabajo);

    useEffect(()=> {
        traerMovimientosPorFecha(new Date(), 0, 'Todos');
        traerOrdenesDeTrabajo(5);
        traerAbonados(2);
        traerBarriosPorMunicipio(0);
    }, [])
    return (
        <>
        <div className="container">
            <Aside/>
            <main>
                <Typography variant="h1">Bienvenido a Telesistema Canal 4</Typography>
                <br/>
                <Grid container spacing={3}>
                    <Grid item lg={6} md={6} xs={12}>
                        <Link style={{textDecoration: 'none'}} to="/cierre-de-caja">
                            <Card className={styles.cartaEstadisticas}>
                                <CardContent>
                                    <Typography variant="h2"><i className="bx bx-line-chart up"></i> Ingresos del día</Typography>
                                    <Typography className={styles.cantidad}>$ {movimientos.filter(item => item.MovimientoCantidad > 0).map(item => item.MovimientoCantidad).reduce((prev, curr) => prev + curr, 0)}</Typography>
                                </CardContent>
                            </Card>
                        </Link>
                    </Grid>
                    <Grid item lg={6} md={6} xs={12}>
                        <Link style={{textDecoration: 'none'}} to="/cierre-de-caja">
                            <Card className={styles.cartaEstadisticas}>
                                <CardContent>
                                    <Typography variant="h2"><i className="bx bx-line-chart-down"></i>  Gastos del día</Typography>
                                    <Typography className={styles.cantidad}>$ {movimientos.filter(item => item.MovimientoCantidad < 0).map(item => item.MovimientoCantidad).reduce((prev, curr) => prev + curr, 0)}</Typography>
                                </CardContent>
                            </Card>
                        </Link>
                    </Grid>
                    <Grid item lg={6} md={6} xs={12}>
                        <Link style={{textDecoration: 'none'}} to="/abonados-activos">
                            <Card className={styles.cartaEstadisticas}>
                                <CardContent>
                                    <Typography variant="h2"><i className="bx bx-user-check"></i>  Abonados activos</Typography>
                                    <Typography className={styles.cantidad}>{abonados.length}</Typography>
                                </CardContent>
                            </Card>
                        </Link>
                    </Grid>
                    <Grid item lg={6} md={6} xs={12}>
                        <Link style={{textDecoration: 'none'}} to="/barrios-municipios">
                            <Card className={styles.cartaEstadisticas}>
                                <CardContent>
                                    <Typography variant="h2"><i className="bx bx-map"></i>  Barrios registrados</Typography>
                                    <Typography className={styles.cantidad}>{barrios.length}</Typography>
                                </CardContent>
                            </Card>
                        </Link>
                    </Grid>
                    <Grid item xs={12} lg={12}>
                        <Link style={{textDecoration: 'none'}} to="ot-pendientes">
                            <Card className={styles.cartaEstadisticas}>
                                <CardContent>
                                    <Typography variant="h2"><i className="bx bx-line-chart up"></i>  Órdenes de trabajo asignadas</Typography>
                                    <Typography className={styles.cantidad}>{ordenesDeTrabajo.length}</Typography>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={cantidadOrdenesDeTrabajo}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="NombreResponsableEjecucion" />
                                            <YAxis type="number" domain={[0, 10]} />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="Cantidad" label fill="#e3ac4d" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </Link>
                    </Grid>
                </Grid>
            </main>
            <Footer/>
        </div>
        </>
    );
}
 
export default Home;