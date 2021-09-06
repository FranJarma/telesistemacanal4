import React, { useReducer } from 'react'
import BarrioContext from './barrioContext';
import BarrioReducer from './barrioReducer';
import clienteAxios from '../../config/axios';

import {LISTA_BARRIOS} from '../../types';

const BarrioState = (props) => {
    const initialState = {
        barrios: []
    };
    const [state, dispatch] = useReducer(BarrioReducer, initialState);
    const traerBarriosPorMunicipio = async (municipioId) => {
        try {
            const resultado = await clienteAxios.get(`/api/barrios/municipio=${municipioId}`);
            dispatch({
                type: LISTA_BARRIOS,
                payload: resultado.data
            });
        } catch (error) {
            console.log(error);
        }
    };
    return(
        <BarrioContext.Provider
            value={{
                barrios: state.barrios,
                traerBarriosPorMunicipio
            }}
        >{props.children}
        </BarrioContext.Provider>
    );
};
export default BarrioState;


