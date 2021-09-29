import { Card, CardContent, Grid, Typography } from '@material-ui/core';
import React from 'react';
import Aside from './design/layout/Aside';
import Footer from './design/layout/Footer';
import useStyles from './Styles';

const Home = () => {
    const styles = useStyles();
    return (
        <>
            <Aside></Aside>
            <Grid container>
                <Grid item lg={4} md={4} xs={12}>
                    <Card className={styles.cartaHome}>
                        <CardContent>
                            <Typography variant="h1">Ingresos del día</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item lg={4} md={4} xs={12}>
                    <Card className={styles.cartaHome}>
                        <CardContent>
                            <Typography variant="h1">Cortes del día</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item lg={4} md={4} xs={12}>
                    <Card className={styles.cartaHome}>
                        <CardContent>
                            <Typography variant="h1">Estadística 3</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
}
 
export default Home;