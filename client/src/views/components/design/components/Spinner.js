import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Typography } from '@material-ui/core';

const Spinner = () => {
    return ( 
    <div style={{display: 'block', textAlign: 'center'}}>
        <CircularProgress/>
        <Typography variant="h6">Cargando...</Typography>
    </div>
     );
}
 
export default Spinner;