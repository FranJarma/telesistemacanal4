import React from 'react';
import {Grid, Card, CardContent, Typography, Button} from '@material-ui/core';
import useStyles from './Styles';
import logo from './../images/logo-ts.png';
import olinet from './../images/olinet.png';
import { Link } from 'react-router-dom';

const Error401 = () => {
    const styles = useStyles();
    return (
        <>
        <div className="container">
        <main>
        <div className='fondo401'>
        <Card className={styles.cartaError}>
            <CardContent>
            <Typography style={{marginBottom: 50}} variant="h6"><i className="bx bx-lock"></i>Usted no tiene permisos para acceder a este recurso</Typography>
                <Link style={{textDecoration: 'none'}} to="/home">
                    <Button color='primary' fullWidth variant="contained">Regresar a Home</Button>
                </Link>
            </CardContent>
        </Card>
        </div>
        </main>
        <footer className='footer'>Error 401 - No Autorizado</footer>
        </div>
        </>
    );
}
 
export default Error401;