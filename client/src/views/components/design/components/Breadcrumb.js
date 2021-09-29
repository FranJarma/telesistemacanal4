import * as React from 'react';
import { Link, Breadcrumbs, Typography} from '@material-ui/core';

const BreadCrumb = ({componente, modelo, ruta}) => {
    return ( 
        <Breadcrumbs style={{marginLeft: '7rem', marginTop: '3rem'}}aria-label="breadcrumb">
        <Link color="inherit" href="/home">
          Home
        </Link>
        <Link color="inherit" href={ruta}>
          {modelo}
        </Link>
        <Typography color="textPrimary">{componente}</Typography>
      </Breadcrumbs>
    );
}
 
export default BreadCrumb;