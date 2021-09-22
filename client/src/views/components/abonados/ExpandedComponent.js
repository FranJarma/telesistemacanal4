import { Typography } from '@material-ui/core';
import React from 'react';

const ExpandedComponent = ({ data }) =>
<>
    <Typography style={{fontWeight: 'bold'}} variant="h6"><i class="bx bx-id-card"></i> DNI: {data.Documento}</Typography>
    <Typography style={{fontWeight: 'bold'}} variant="h6"><i class="bx bx-map"></i> Barrio: {data.Barrio}</Typography>
    <Typography style={{fontWeight: 'bold'}} variant="h6"><i class="bx bx-home"></i> Domicilio: {data.Domicilio}</Typography>
    <Typography style={{fontWeight: 'bold'}} variant="h6"><i class="bx bx-plug"></i> Servicio: {data.Servicio}</Typography>
</>;
export default ExpandedComponent;
