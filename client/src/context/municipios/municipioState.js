import React, { useReducer } from 'react'
import MunicipioContext from './municipioContext';
import MunicipioReducer from './municipioReducer';
import clienteAxios from '../../config/axios';

import {LISTA_MUNICIPIOS} from '../../types';

const MunicipioState = (props) => {
    const initialState = {
        municipios: []
    };
    const [state, dispatch] = useReducer(MunicipioReducer, initialState);
    const traerMunicipiosPorProvincia = async (provinciaId) => {
        try {
            const resultado = await clienteAxios.get(`/api/municipios/provincia=${provinciaId}`);
            dispatch({
                type: LISTA_MUNICIPIOS,
                payload: resultado.data
            });
        } catch (error) {
            console.log(error);
        }
    };
    return(
        <MunicipioContext.Provider
            value={{
                municipios: state.municipios,
                traerMunicipiosPorProvincia
            }}
        >{props.children}
        </MunicipioContext.Provider>
    );
};
export default MunicipioState;


