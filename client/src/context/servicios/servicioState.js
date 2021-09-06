import React, { useReducer } from 'react'
import ServicioContext from './servicioContext';
import ServicioReducer from './servicioReducer';
import clienteAxios from '../../config/axios';

import {LISTA_SERVICIOS} from '../../types';

const ServicioState = (props) => {
    const initialState = {
        servicios: []
    };
    const [state, dispatch] = useReducer(ServicioReducer, initialState);
    const traerServicios = async () => {
        try {
            const resultado = await clienteAxios.get(`/api/servicios`);
            dispatch({
                type: LISTA_SERVICIOS,
                payload: resultado.data
            });
        } catch (error) {
            console.log(error);
        }
    };
    return(
        <ServicioContext.Provider
            value={{
                servicios: state.servicios,
                traerServicios
            }}
        >{props.children}
        </ServicioContext.Provider>
    );
};
export default ServicioState;


