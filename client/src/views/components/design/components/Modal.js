import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

const Modal = ({abrirModal, funcionCerrar, titulo, mensaje, formulario, botones}) => {
    return (
        <Dialog style={{zIndex: 1}} open={abrirModal} onClose={funcionCerrar} maxWidth={'sm'}>
            <DialogTitle>{titulo}</DialogTitle>
            <DialogContent style={{overflow: 'hidden'}}>
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