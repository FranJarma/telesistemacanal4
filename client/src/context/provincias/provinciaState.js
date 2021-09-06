import React, { useReducer } from 'react'
import ProvinciaContext from './provinciaContext';
import ProvinciaReducer from './provinciaReducer';
import clienteAxios from '../../config/axios';

import {LISTA_PROVINCIAS} from '../../types';

const ProvinciaState = (props) => {
    const initialState = {
        provincias: []
    };
    const [state, dispatch] = useReducer(ProvinciaReducer, initialState);
    const traerProvincias = async () => {
        try {
            const resultado = await clienteAxios.get('/api/provincias');
            dispatch({
                type: LISTA_PROVINCIAS,
                payload: resultado.data
            });
        } catch (error) {
            console.log(error);
        }
    };
    return(
        <ProvinciaContext.Provider
            value={{
                provincias: state.provincias,
                traerProvincias
            }}
        >{props.children}
        </ProvinciaContext.Provider>
    );
};
export default ProvinciaState;


