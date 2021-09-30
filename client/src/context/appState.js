import React, { useReducer } from 'react';
import { useHistory } from 'react-router-dom';
import AppContext from './appContext';
import AppReducer from './appReducer';
import clienteAxios from '../config/axios';
import Toast from './../views/components/design/components/Toast';
import Swal from './../views/components/design/components/Swal';
import * as TYPES from '../types';

const AppState = props => {
    const initialState = {
        abonados: [],
        domicilios: [],
        domicilio: {},
        barrios: [],
        condicionesIVA: [],
        municipios: [],
        provincias: [],
        servicios: [],
        onus: [],
        tiposOnus: []
    }
    const history = useHistory();
    const [state, dispatch] = useReducer(AppReducer, initialState);
    //TODO: AUTH
    //ABONADOS
    const crearAbonado = async (abonado) => {
        clienteAxios.post('/api/usuarios/abonados/create', abonado)
        .then(resOk => {
            if (resOk.data)
                dispatch({
                    type: TYPES.CREAR_ABONADO,
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
                    type: TYPES.MODIFICAR_ABONADO,
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
                    type: TYPES.DAR_DE_BAJA_ABONADO,
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
                    type: TYPES.CAMBIO_DOMICILIO_ABONADO,
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
                type: TYPES.LISTA_ABONADOS_ACTIVOS,
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
                type: TYPES.LISTA_ABONADOS_INACTIVOS,
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
                type: TYPES.LISTA_DOMICILIOS_ABONADOS,
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
                type: TYPES.ULTIMO_DOMICILIO,
                payload: resultado.data
            });
        } catch (error) {
            console.log(error);
        }
    };
    //BARRIOS
    const traerBarriosPorMunicipio = async (municipioId) => {
        try {
            const resultado = await clienteAxios.get(`/api/barrios/municipio=${municipioId}`);
            dispatch({
                type: TYPES.LISTA_BARRIOS,
                payload: resultado.data
            });
        } catch (error) {
            console.log(error);
        }
    };
    //CONDICIONES IVA
    const traerCondicionesIVA = async () => {
        try {
            const resultado = await clienteAxios.get(`/api/condicionesIVA`);
            dispatch({
                type: TYPES.LISTA_CONDICIONES_IVA,
                payload: resultado.data
            });
        } catch (error) {
            console.log(error);
        }
    };
    //MUNICIPIOS
    const traerMunicipiosPorProvincia = async (provinciaId) => {
        try {
            const resultado = await clienteAxios.get(`/api/municipios/provincia=${provinciaId}`);
            dispatch({
                type: TYPES.LISTA_MUNICIPIOS,
                payload: resultado.data
            });
        } catch (error) {
            console.log(error);
        }
    };
    //PROVINCIAS
    const traerProvincias = async () => {
        try {
            const resultado = await clienteAxios.get('/api/provincias');
            dispatch({
                type: TYPES.LISTA_PROVINCIAS,
                payload: resultado.data
            });
        } catch (error) {
            console.log(error);
        }
    };
    //SERVICIOS
    const traerServicios = async () => {
        try {
            const resultado = await clienteAxios.get(`/api/servicios`);
            dispatch({
                type: TYPES.LISTA_SERVICIOS,
                payload: resultado.data
            });
        } catch (error) {
            console.log(error);
        }
    };
    return(
        <AppContext.Provider
        value={{
            abonados: state.abonados,
            domicilios: state.domicilios,
            domicilio: state.domicilio,
            barrios: state.barrios,
            condicionesIVA: state.condicionesIVA,
            municipios: state.municipios,
            provincias: state.provincias,
            servicios: state.servicios,
            onus: state.onus,
            tiposOnus: state.tiposOnus,
            crearAbonado, modificarAbonado, darDeBajaAbonado, cambioDomicilioAbonado, traerAbonadosActivos, traerAbonadosInactivos, traerUltimoDomicilioAbonado,
            traerDomiciliosAbonado, traerBarriosPorMunicipio, traerCondicionesIVA, traerMunicipiosPorProvincia, traerProvincias, traerServicios
        }}>{props.children}
        </AppContext.Provider>
    )
};
export default AppState;