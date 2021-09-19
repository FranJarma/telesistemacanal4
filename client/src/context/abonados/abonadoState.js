import React, { useReducer } from 'react'
import AbonadoContext from './abonadoContext';
import AbonadoReducer from './abonadoReducer';
import clienteAxios from '../../config/axios';
import Toast from './../../views/components/design/components/Toast';
import Swal from './../../views/components/design/components/Swal';
import {CREAR_ABONADO, MODIFICAR_ABONADO, LISTA_ABONADOS_ACTIVOS, LISTA_ABONADOS_INACTIVOS, ERROR_FORMULARIO_ABONADO} from '../../types';

const AbonadoState = (props) => {
    const initialState = {
        abonados: [],
        errorFormulario: true
    };
    const [state, dispatch] = useReducer(AbonadoReducer, initialState);
    const crearAbonado = async (abonado) => {
        clienteAxios.post('/api/usuarios/abonados/create', abonado)
        .then(resOk => {
            if (resOk.data)
                Swal('Operación completa', resOk.data.msg);
                dispatch({
                    type: CREAR_ABONADO,
                    payload: resOk.data.msg
                });
        })
        .catch(err => {
            if(!err.response){
                Toast('Error de conexión', 'error');
            }
            else {
                Toast(err.response.data.errors[0].msg, 'warning');
            }
            dispatch({
                type: ERROR_FORMULARIO_ABONADO,
                payload: true
            });
        })
    }
    const modificarAbonado = async (abonado) => {
        clienteAxios.put(`/api/usuarios/abonados/update/${abonado.UserId}`, abonado)
        .then(resOk => {
            if (resOk.data)
                Swal('Operación completa', resOk.data.msg);
                dispatch({
                    type: MODIFICAR_ABONADO,
                    payload: resOk.data.msg
                })
        })
        .catch(err => {
            if(!err.response){
                Toast('Error de conexión', 'error');
            }
            else {
                Toast(err.response.data.errors[0].msg, 'warning');
            }
        })
    }
    const traerAbonadosActivos = async () => {
        try {
            const resultado = await clienteAxios.get('/api/usuarios/abonados/activos');
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
                errorFormulario: state.errorFormulario,
                crearAbonado,
                modificarAbonado,
                traerAbonadosActivos,
                traerAbonadosInactivos
            }}
        >{props.children}
        </AbonadoContext.Provider>
    );
};
export default AbonadoState;


