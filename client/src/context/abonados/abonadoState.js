import React, { useReducer } from 'react'
import AbonadoContext from './abonadoContext';
import AbonadoReducer from './abonadoReducer';
import clienteAxios from '../../config/axios';

import {LISTA_ABONADOS_ACTIVOS, LISTA_ABONADOS_INACTIVOS} from '../../types';

const AbonadoState = (props) => {
    const initialState = {
        abonados: []
    };
    const [state, dispatch] = useReducer(AbonadoReducer, initialState);
    const traerAbonadosActivos = async () => {
        try {
            const resultado = await clienteAxios.get('/api/abonados/activos');
            dispatch({
                type: LISTA_ABONADOS_ACTIVOS,
                payload: resultado.data
            });
        } catch (error) {
            console.log(error);
        }
    };
    const traerAbonadosInactivos = async () => {
        try {
            const resultado = await clienteAxios.get('/api/abonados/inactivos');
            dispatch({
                type: LISTA_ABONADOS_INACTIVOS,
                payload: resultado
            });
        } catch (error) {
            console.log(error);
        }
    };
    return(
        <AbonadoContext.Provider
            value={{
                abonados: state.abonados,
                traerAbonadosActivos,
                traerAbonadosInactivos
            }}
        >{props.children}
        </AbonadoContext.Provider>
    );
};
export default AbonadoState;


