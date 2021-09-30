import React, { useReducer } from 'react'
import { useHistory } from 'react-router';
import AbonadoContext from './abonadoContext';
import AbonadoReducer from './abonadoReducer';
import clienteAxios from '../../config/axios';
import Toast from './../../views/components/design/components/Toast';
import Swal from './../../views/components/design/components/Swal';
import {CREAR_ABONADO, MODIFICAR_ABONADO, DAR_DE_BAJA_ABONADO, CAMBIO_DOMICILIO_ABONADO, LISTA_ABONADOS_ACTIVOS, LISTA_ABONADOS_INACTIVOS,
LISTA_DOMICILIOS_ABONADOS, ULTIMO_DOMICILIO} from '../../types';

const AbonadoState = (props) => {
    const initialState = {
        abonados: [],
        domicilios: [],
        domicilio: {}
    };
    const history = useHistory();
    const [state, dispatch] = useReducer(AbonadoReducer, initialState);
    const crearAbonado = async (abonado) => {
        clienteAxios.post('/api/usuarios/abonados/create', abonado)
        .then(resOk => {
            if (resOk.data)
                dispatch({
                    type: CREAR_ABONADO,
                    payload: abonado
                });
                Swal('Operación completa', resOk.data.msg);
                //history.push('/abonados-activos');
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
    const modificarAbonado = async (abonado) => {
        clienteAxios.put(`/api/usuarios/abonados/update/${abonado.UserId}`, abonado)
        .then(resOk => {
            if (resOk.data)
                dispatch({
                    type: MODIFICAR_ABONADO,
                    payload: abonado
                })
                Swal('Operación completa', resOk.data.msg);
                history.push('/abonados-activos');
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
    const darDeBajaAbonado = async(infoBaja) => {
        clienteAxios.put(`/api/usuarios/abonados/delete/${infoBaja.idAbonadoBaja}`, infoBaja)
        .then(resOk => {
            if (resOk.data)
                dispatch({
                    type: DAR_DE_BAJA_ABONADO,
                    payload: infoBaja
                })
                Swal('Operación completa', resOk.data.msg);
                history.push('/abonados-activos');
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

    const cambioDomicilioAbonado = async(infoCambioDomicilio) => {
        clienteAxios.put(`/api/usuarios/abonados/cambio-domicilio/${infoCambioDomicilio.id}`, infoCambioDomicilio)
        .then(resOk => {
            if (resOk.data)
                dispatch({
                    type: CAMBIO_DOMICILIO_ABONADO,
                    payload: infoCambioDomicilio
                })
                Swal('Operación completa', resOk.data.msg);
                history.push('/abonados-activos');
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
            const resultado = await clienteAxios.get('/api/usuarios/abonados/inactivos');
            dispatch({
                type: LISTA_ABONADOS_INACTIVOS,
                payload: resultado.data
            });
        } catch (error) {
            console.log(error);
        }
    };
    const traerDomiciliosAbonado = async (id) => {
        try {
            const resultado = await clienteAxios.get(`/api/usuarios/abonados/domicilios/${id}`);
            dispatch({
                type: LISTA_DOMICILIOS_ABONADOS,
                payload: resultado.data
            });
        } catch (error) {
            console.log(error);
        }
    };
    const traerUltimoDomicilioAbonado = async (id) => {
        try {
            const resultado = await clienteAxios.get(`/api/usuarios/abonados/domicilio/${id}`);
            dispatch({
                type: ULTIMO_DOMICILIO,
                payload: resultado.data
            });
        } catch (error) {
            console.log(error);
        }
    };
    return(
        <AbonadoContext.Provider
            value={{
                abonados: state.abonados,
                domicilios: state.domicilios,
                domicilio: state.domicilio,
                crearAbonado,
                modificarAbonado,
                darDeBajaAbonado,
                cambioDomicilioAbonado,
                traerAbonadosActivos,
                traerAbonadosInactivos,
                traerDomiciliosAbonado,
                traerUltimoDomicilioAbonado
            }}
        >{props.children}
        </AbonadoContext.Provider>
    );
};
export default AbonadoState;


