import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

const Modal = ({abrirModal, funcionCerrar, titulo, mensaje, formulario, botones}) => {
    return (
        <Dialog style={{zIndex: 1000}} open={abrirModal} onClose={funcionCerrar} fullWidth maxWidth={'lg'}>
            <DialogTitle>{titulo}</DialogTitle>
            <DialogContent>
                <DialogContentText>{mensaje}</DialogContentText>
                    {formulario}
            </DialogContent>
            <DialogActions>
                {botones}
            </DialogActions>
        </Dialog>
    );
}
export default Modal;