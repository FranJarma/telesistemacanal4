import React, { useReducer } from 'react'
import CondicionesIVAContext from './condicionesIVAContext';
import CondicionesIVAReducer from './condicionesIVAReducer';
import clienteAxios from '../../config/axios';

import {LISTA_CONDICIONES_IVA} from '../../types';

const CondicionesIVAState = (props) => {
    const initialState = {
        condicionesIVA: []
    };
    const [state, dispatch] = useReducer(CondicionesIVAReducer, initialState);
    const traerCondicionesIVA = async () => {
        try {
            const resultado = await clienteAxios.get(`/api/condicionesIVA`);
            dispatch({
                type: LISTA_CONDICIONES_IVA,
                payload: resultado.data
            });
        } catch (error) {
            console.log(error);
        }
    };
    return(
        <CondicionesIVAContext.Provider
            value={{
                condicionesIVA: state.condicionesIVA,
                traerCondicionesIVA
            }}
        >{props.children}
        </CondicionesIVAContext.Provider>
    );
};
export default CondicionesIVAState;


