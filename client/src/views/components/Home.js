import { Card, CardContent, Grid, Typography } from '@material-ui/core';
import React from 'react';
import Aside from './design/layout/Aside';
import Footer from './design/layout/Footer';
import useStyles from './Styles';
import {XYPlot, LineSeries, VerticalGridLines, HorizontalGridLines, XAxis, YAxis, VerticalBarSeries} from 'react-vis';

const Home = () => {
    const styles = useStyles();
    const data = [
        {x: 0, y: 8},
        {x: 1, y: 5},
        {x: 2, y: 4},
        {x: 3, y: 9},
        {x: 4, y: 1},
        {x: 5, y: 7},
        {x: 6, y: 6},
        {x: 7, y: 3},
        {x: 8, y: 2},
        {x: 9, y: 0}
    ];

    return (
        <>
        <div className="container">
            <Aside/>
            <main>
                <Grid container>
                    <Grid item lg={4} md={4} xs={12}>
                        <Card className={styles.cartaHome}>
                            <CardContent>
                                <Typography variant="h1">Ingresos del día</Typography>
                                <Typography className={styles.cantidad}>$2550</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item lg={4} md={4} xs={12}>
                        <Card className={styles.cartaHome}>
                            <CardContent>
                                <Typography variant="h1">Ordenes de trabajo pendientes</Typography>
                                <Typography className={styles.cantidad}>120</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item lg={4} md={4} xs={12}>
                        <Card className={styles.cartaHome}>
                            <CardContent>
                                <Typography variant="h1">Abonados activos</Typography>
                                <Typography className={styles.cantidad}>3200</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </main>
            <Footer/>
        </div>
        </>
    );
}
 
export default Home;