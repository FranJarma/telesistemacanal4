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
        pago: {},
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
    const traerPagosPorAbonado = async (UserId) => {
        try {
            const resultado = await clienteAxios.get(`/api/pagos/${UserId}`);
            dispatch({
                type: TYPES.LISTA_PAGOS_ABONADO,
                payload: resultado.data
            })
        } catch (error) {
            console.log(error);
        }
    }
    const traerPago = async (UserId, PagoPeriodo) => {
        try {
            const resultado = await clienteAxios.get('/api/pagos',{
                params: {
                    UserId,
                    PagoPeriodo
                }
            });
            dispatch({
                type: TYPES.TRAER_PAGO,
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
    const crearBarrio = async(barrio, cerrarModal) => {
        clienteAxios.post('/api/barrios/create', barrio)
        .then(resOk => {
            if (resOk.data)
                dispatch({
                    type: TYPES.CREAR_BARRIO,
                    payload: barrio
                });
                Swal('Operación completa', resOk.data.msg);
                cerrarModal(true);
        })
        .catch(err => {
            console.log(err);
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
    const modificarBarrio = async(barrio, cerrarModal) => {
        clienteAxios.put('/api/barrios/update', barrio)
        .then(resOk => {
            if (resOk.data)
                dispatch({
                    type: TYPES.EDITAR_BARRIO,
                    payload: barrio
                });
                Swal('Operación completa', resOk.data.msg);
                cerrarModal(true);
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
    const eliminarBarrio = async(barrio, cerrarModal) => {
        clienteAxios.put('/api/barrios/delete', barrio)
        .then(resOk => {
            if (resOk.data)
                dispatch({
                    type: TYPES.ELIMINAR_BARRIO,
                    payload: barrio
                });
                Swal('Operación completa', resOk.data.msg);
                cerrarModal(true);
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
    const traerBarriosPorMunicipio = async (municipioId) => {
        try {
            let resultado = null;
            municipioId === 0 ? resultado = await clienteAxios.get('/api/barrios') : resultado = await clienteAxios.get(`/api/barrios/municipio=${municipioId}`);
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
    const crearMunicipio = async(municipio, cerrarModal) => {
        console.log(municipio);
        clienteAxios.post('/api/municipios/create', municipio)
        .then(resOk => {
            if (resOk.data)
                dispatch({
                    type: TYPES.CREAR_MUNICIPIO,
                    payload: municipio
                });
                Swal('Operación completa', resOk.data.msg);
                cerrarModal(true);
        })
        .catch(err => {
            console.log(err);
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
    const modificarMunicipio = async(municipio, cerrarModal) => {
        clienteAxios.put('/api/municipios/update', municipio)
        .then(resOk => {
            if (resOk.data)
                dispatch({
                    type: TYPES.EDITAR_MUNICIPIO,
                    payload: municipio
                });
                Swal('Operación completa', resOk.data.msg);
                cerrarModal(true);
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
    const eliminarMunicipio = async(municipio, cerrarModal) => {
        clienteAxios.put('/api/municipios/delete', municipio)
        .then(resOk => {
            if (resOk.data)
                dispatch({
                    type: TYPES.ELIMINAR_MUNICIPIO,
                    payload: municipio
                });
                Swal('Operación completa', resOk.data.msg);
                cerrarModal(true);
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
    const traerMunicipiosPorProvincia = async (provinciaId) => {
        try {
            let resultado = null;
            provinciaId === 0 ? resultado = await clienteAxios.get('/api/municipios') : resultado = await clienteAxios.get(`/api/municipios/provincia=${provinciaId}`);
            dispatch({
                type: TYPES.LISTA_MUNICIPIOS,
                payload: resultado.data
            });
        } catch (error) {
            console.log(error);
        }
    };
    const traerMunicipios = async () => {
        try {
            const resultado = await clienteAxios.get(`/api/municipios`);
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
    const crearServicio = async(servicio, cerrarModal) => {
        clienteAxios.post('/api/servicios/create', servicio)
        .then(resOk => {
            if (resOk.data)
                dispatch({
                    type: TYPES.CREAR_SERVICIO,
                    payload: servicio
                });
                Swal('Operación completa', resOk.data.msg);
                cerrarModal(true);
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
    const modificarServicio = async(servicio, cerrarModal) => {
        clienteAxios.put('/api/servicios/update', servicio)
        .then(resOk => {
            if (resOk.data)
                dispatch({
                    type: TYPES.EDITAR_SERVICIO,
                    payload: servicio
                });
                Swal('Operación completa', resOk.data.msg);
                cerrarModal(true);
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
    const eliminarServicio = async(servicio, cerrarModal) => {
        clienteAxios.put('/api/servicios/delete', servicio)
        .then(resOk => {
            if (resOk.data)
                dispatch({
                    type: TYPES.ELIMINAR_SERVICIO,
                    payload: servicio
                });
                Swal('Operación completa', resOk.data.msg);
                cerrarModal(true);
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
            pago: state.pago,
            detallesPago: state.detallesPago,
            crearAbonado, modificarAbonado, cambiarEstadoAbonado, cambioDomicilioAbonado, cambioServicioAbonado, crearPago, traerAbonadosInscriptos, traerAbonadosActivos,
            traerAbonadosInactivos, traerServiciosAbonado, traerDomiciliosAbonado, traerBarriosPorMunicipio, traerCondicionesIva, traerMunicipiosPorProvincia,
            traerProvincias, traerServicios, traerModelosONU, traerMediosPago, traerPagosPorAbonado, traerPago, traerDetallesPago, crearServicio, modificarServicio, eliminarServicio,
            crearBarrio, modificarBarrio, eliminarBarrio, crearMunicipio, modificarMunicipio, eliminarMunicipio, traerMunicipios
        }}>{props.children}
        </AppContext.Provider>
    )
};
export default AppState;