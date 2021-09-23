import React from 'react';
import { TextField, MenuItem } from '@material-ui/core';

const TextFieldBuscador = (onChange, value, label, lista, ItemId, ItemNombre) => {
    return (
    <>
    <TextField
        variant = "outlined"
        onChange={onChange}
        value={value}
        label={label}
        fullWidth
        select
        >
        {lista.length > 0 ? lista.map((item)=>(
            <MenuItem key={ItemId} value={ItemId}>{ItemNombre}</MenuItem>
        )): <MenuItem disabled>No se encontraron {lista}</MenuItem>}
    </TextField>
    </>
    );
}
 
export default TextFieldBuscador;