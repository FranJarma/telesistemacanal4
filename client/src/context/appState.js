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
        barrios: [],
        condicionesIva: [],
        municipios: [],
        provincias: [],
        servicios: [],
        onus: [],
        modelosOnu: [],
        historialDomicilios: [],
        historialServicios: [],
        mediosPago: [],
        pagos: [],
        detallesPago: []
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
                history.push('/abonados-inscriptos');
        })
        .catch(err => {
            if(!err.response){
                Toast('Error de conexión', 'error');
            }
            else if(err.response.data.msg){
                Toast(err.response.data.msg, 'warning');
            }
            else if(err.response.data.errors){
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
                history.push('/abonados-inscriptos');
        })
        .catch(err => {
            if(!err.response){
                Toast('Error de conexión', 'error');
            }
            else if(err.response.data.msg){
                Toast(err.response.data.msg, 'warning');
            }
            else if(err.response.data.errors){
                Toast(err.response.data.errors[0].msg, 'warning');
            }
        })
    }
    const cambiarEstadoAbonado = async(abonado) => {
        clienteAxios.put(`/api/usuarios/abonados/cambiar-estado/${abonado.UserId}`, abonado)
        .then(resOk => {
            if (resOk.data)
                dispatch({
                    type: TYPES.CAMBIAR_ESTADO_ABONADO,
                    payload: abonado
                })
                Swal('Operación completa', resOk.data.msg);
                abonado.EstadoId === 1 ? history.push('/abonados-inscriptos') : abonado.EstadoId === 2 ? history.push('/abonados-activos') : history.push('/abonados-inactivos');
        })
        .catch(err => {
            console.log(err.response.data.msg);
            if(!err.response){
                Toast('Error de conexión', 'error');
            }
            else if(err.response.data.msg){
                Toast(err.response.data.msg, 'warning');
            }
            else if(err.response.data.errors){
                Toast(err.response.data.errors[0].msg, 'warning');
            }
        })
    }
    const cambioDomicilioAbonado = async(domicilio) => {
        clienteAxios.put(`/api/usuarios/abonados/cambio-domicilio/${domicilio.UserId}`, domicilio)
        .then(resOk => {
            if (resOk.data)
                dispatch({
                    type: TYPES.CAMBIO_DOMICILIO_ABONADO,
                    payload: domicilio
                })
                Swal('Operación completa', resOk.data.msg);
        })
        .catch(err => {
            if(!err.response){
                Toast('Error de conexión', 'error');
            }
            else if(err.response.data.msg){
                Toast(err.response.data.msg, 'warning');
            }
            else if(err.response.data.errors){
                Toast(err.response.data.errors[0].msg, 'warning');
            }
        })
    }
    const cambioServicioAbonado = async(servicio) => {
        clienteAxios.put(`/api/usuarios/abonados/cambio-servicio/${servicio.UserId}`, servicio)
        .then(resOk => {
            if (resOk.data)
                dispatch({
                    type: TYPES.CAMBIO_SERVICIO_ABONADO,
                    payload: servicio
                })
                Swal('Operación completa', resOk.data.msg);
        })
        .catch(err => {
            if(!err.response){
                Toast('Error de conexión', 'error');
            }
            else if(err.response.data.msg){
                Toast(err.response.data.msg, 'warning');
            }
            else if(err.response.data.errors){
                Toast(err.response.data.errors[0].msg, 'warning');
            }
        })
    }
    const traerAbonadosInscriptos = async () => {
        try {
            const resultado = await clienteAxios.get('/api/usuarios/abonados/inscriptos');
            dispatch({
                type: TYPES.LISTA_ABONADOS_INSCRIPTOS,
                payload: resultado.data
            });
        } catch (error) {
            console.log(error);
        }
    };
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
                type: TYPES.LISTA_DOMICILIOS_ABONADO,
                payload: resultado.data
            });
        } catch (error) {
            console.log(error);
        }
    };
    const traerServiciosAbonado = async (id) => {
        try {
            const resultado = await clienteAxios.get(`/api/usuarios/abonados/servicios/${id}`);
            dispatch({
                type: TYPES.LISTA_SERVICIOS_ABONADO,
                payload: resultado.data
            });
        } catch (error) {
            console.log(error);
        }
    };
    const traerPagosPorAbonado = async (id) => {
        try {
            const resultado = await clienteAxios.get(`/api/pagos/${id}`);
            dispatch({
                type: TYPES.LISTA_PAGOS_ABONADO,
                payload: resultado.data
            })
        } catch (error) {
            console.log(error);
        }
    }
    const traerDetallesPago = async (id) => {
        try {
            const resultado = await clienteAxios.get(`/api/detallesPago/${id}`);
            dispatch({
                type: TYPES.LISTA_DETALLES_PAGO_ABONADO,
                payload: resultado.data
            })
        } catch (error) {
            console.log(error);
        }
    }
    //PAGOS
    const crearPago = async(pago) => {
        clienteAxios.post('/api/pagos/create', pago)
        .then(resOk => {
            if (resOk.data)
                dispatch({
                    type: TYPES.CREAR_PAGO,
                    payload: pago
                });
                Swal('Operación completa', resOk.data.msg);
                window.location.reload();
        })
        .catch(err => {
            if(!err.response){
                Toast('Error de conexión', 'error');
            }
            else if(err.response.data.msg){
                Toast(err.response.data.msg, 'warning');
            }
            else if(err.response.data.errors){
                Toast(err.response.data.errors[0].msg, 'warning');
            }
        })
    }
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
    const traerCondicionesIva = async () => {
        try {
            const resultado = await clienteAxios.get(`/api/condicionesIva`);
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
    //MODELOS ONU
    const traerModelosONU = async () => {
        try {
            const resultado = await clienteAxios.get('/api/modelosOnu');
            dispatch({
                type: TYPES.LISTA_MODELOS_ONU,
                payload: resultado.data
            })
        } catch (error) {
            console.log(error);
        }
    }
    //MEDIOS PAGO
    const traerMediosPago = async () => {
        try {
            const resultado = await clienteAxios.get('/api/mediosPago');
            dispatch({
                type: TYPES.LISTA_MEDIOS_DE_PAGO,
                payload: resultado.data
            })
        } catch (error) {
            console.log(error);
        }
    }
    return(
        <AppContext.Provider
        value={{
            abonados: state.abonados,
            domicilios: state.domicilios,
            barrios: state.barrios,
            condicionesIva: state.condicionesIva,
            municipios: state.municipios,
            provincias: state.provincias,
            servicios: state.servicios,
            onus: state.onus,
            modelosOnu: state.modelosOnu,
            historialDomicilios: state.historialDomicilios,
            historialServicios: state.historialServicios,
            mediosPago: state.mediosPago,
            pagos: state.pagos,
            detallesPago: state.detallesPago,
            crearAbonado, modificarAbonado, cambiarEstadoAbonado, cambioDomicilioAbonado, cambioServicioAbonado, crearPago, traerAbonadosInscriptos, traerAbonadosActivos,
            traerAbonadosInactivos, traerServiciosAbonado, traerDomiciliosAbonado, traerBarriosPorMunicipio, traerCondicionesIva, traerMunicipiosPorProvincia,
            traerProvincias, traerServicios, traerModelosONU, traerMediosPago, traerPagosPorAbonado, traerDetallesPago
        }}>{props.children}
        </AppContext.Provider>
    )
};
export default AppState;