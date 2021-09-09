import React, { useReducer } from 'react'
import ErrorsContext from './errorContext';
import ErrorsReducer from './errorReducer';

import {MOSTRAR_ERROR, OCULTAR_ERROR} from '../../types';

const ErrorsState = (props) => {
    const initialState = {
        error: null
    };
    const [state, dispatch] = useReducer(ErrorsReducer, initialState);

    const mostrarError = (mensaje, categoria) => {
        dispatch({
            type: MOSTRAR_ERROR,
            payload: {
                mensaje,
                categoria
            }
        })
        setTimeout(()=>{
            dispatch({
                type: OCULTAR_ERROR
            })
        }, 5000)
    }
    return(
        <ErrorsContext.Provider
            value={{
                error: state.error,
                mostrarError
            }}
        >{props.children}
        </ErrorsContext.Provider>
    );
};
export default ErrorsState;


