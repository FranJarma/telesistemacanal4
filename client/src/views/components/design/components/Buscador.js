import React from 'react';
import { TextField } from '@material-ui/core';

const Buscador = ({textoFiltrado, onFiltrar}) => {
    return (
        <TextField
            autoFocus
            placeholder="Buscar"
            InputProps={{
                endAdornment: <i className="bx bx-search"></i>
            }}
            value={textoFiltrado}
            onChange={onFiltrar}
        />
    );
}
 
export default Buscador;