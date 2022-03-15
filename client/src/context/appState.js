import React, { useReducer } from 'react';
import { useHistory } from 'react-router-dom';
import AppContext from './appContext';
import AppReducer from './appReducer';
import clienteAxios from '../config/axios';
import Toast from './../views/components/design/components/Toast';
import Swal from './../views/components/design/components/Swal';
import * as TYPES from '../types';
import tokenAuthHeaders from '../config/token';
import swal from 'sweetalert2';

const AppState = props => {
    const initialState = {
        token: sessionStorage.getItem('token'),
        usuarioLogueado: null,
        usuarioAutenticado: false,
        push: false,
        usuarios: [],
        roles: [],
        rolesUser: [],
        permisos: [],
        permisosRol: [],
        abonados: [],
        abonado: {},
        domicilios: [],
        barrios: [],
        condicionesIva: [],
        municipios: [],
        provincias: [],
        servicios: [],
        onu: {},
        onus: [],
        modelosONU: [],
        historialDomicilios: [],
        historialServicios: [],
        mediosPago: [],
        pagos: [],
        inscripcion: [],
        detallesPago: [],
        tareas: [],
        ordenesDeTrabajo: [],
        ordenesDeTrabajoAsignadas: [],
        tecnicosOrdenDeTrabajo: [],
        tareasOrdenDeTrabajo: [],
        movimientos: [],
        conceptos: []
    }
    const history = useHistory();
    const [state, dispatch] = useReducer(AppReducer, initialState);
    //AUTH
    //retorna el usuario autenticado, nos servirá tanto al momento del registro como del logueo
    const obtenerUsuarioAutenticado = async ()=>{
        //leemos en el local storage si hay un token
        const token = sessionStorage.getItem('token');
        if (token) {
            // funcion para enviar el token por headers
            tokenAuthHeaders(token);
        }
        try {
            //obtenemos la respuesta de la peticion a la base de datos, para obtener info del usuario
            const respuesta = await clienteAxios.get('/api/auth/login');
            dispatch({
                type: TYPES.OBTENER_INFO_USUARIO,
                payload: respuesta.data
            });
        } catch (error) {
            console.log(error);
            dispatch({
                type: TYPES.CERRAR_SESION
            })
            Toast(error.response.data.msg, 'warning');
        }
    };
    const iniciarSesion = async(usuario) => {
        try {
            const respuesta = await clienteAxios.post('/api/auth/login', usuario);
            dispatch({
                type: TYPES.LOGIN_EXITOSO,
                payload: respuesta.data
            })
            obtenerUsuarioAutenticado();
        } catch (error) {
            if(!error.response){
                Toast('Error de conexión con el servidor', 'error');
            }
            else if(error.response.data.msg){
                Toast(error.response.data.msg, 'warning');
            }
            else if(error.response.data.errors){
                Toast(error.response.data.errors[0].msg, 'warning');
            }
        }
    }
    const cerrarSesion = () => {
        try {
            dispatch({
                type: TYPES.CERRAR_SESION
            })
            history.push('/');
        } catch (error) {
            console.log(error);
        }
    }
    const crearUsuario = async (usuario) => {
        clienteAxios.post('/api/usuarios/create', usuario)
        .then(resOk => {
            if (resOk.data)
                dispatch({
                    type: TYPES.CREAR_USUARIO,
                    payload: usuario
                });
                Swal('Operación completa', resOk.data.msg);
                history.push('/users');
        })
        .catch(err => {
            if(!err.response){
                Toast('Error de conexión con el servidor', 'error');
            }
            else if(err.response.data.msg){
                Toast(err.response.data.msg, 'warning');
            }
            else if(err.response.data.errors){
                Toast(err.response.data.errors[0].msg, 'warning');
            }
        })
    }
    const modificarUsuario = async (usuario, desdePerfilUser) => {
        clienteAxios.put(`/api/usuarios/update/${usuario.UserId}`, usuario)
        .then(resOk => {
            if (resOk.data)
                dispatch({
                    type: TYPES.MODIFICAR_USUARIO,
                    payload: usuario
                })
                Swal('Operación completa', resOk.data.msg);
                if (!desdePerfilUser) history.push('/users');
        })
        .catch(err => {
            if(!err.response){
                Toast('Error de conexión con el servidor', 'error');
            }
            else if(err.response.data.msg){
                Toast(err.response.data.msg, 'warning');
            }
            else if(err.response.data.errors){
                Toast(err.response.data.errors[0].msg, 'warning');
            }
        })
    }
    const eliminarUsuario = async (usuario) => {
        clienteAxios.put(`/api/usuarios/delete/${usuario.UserId}`, usuario)
        .then(resOk => {
            if (resOk.data)
                dispatch({
                    type: TYPES.ELIMINAR_USUARIO,
                    payload: usuario
                })
                Swal('Operación completa', resOk.data.msg);
        })
        .catch(err => {
            if(!err.response){
                Toast('Error de conexión con el servidor', 'error');
            }
            else if(err.response.data.msg){
                Toast(err.response.data.msg, 'warning');
            }
            else if(err.response.data.errors){
                Toast(err.response.data.errors[0].msg, 'warning');
            }
        })
    }
    const crearRol = async (rol) => {
        clienteAxios.post('/api/roles/create', rol)
        .then(resOk => {
            if (resOk.data)
                dispatch({
                    type: TYPES.CREAR_ROL,
                    payload: rol
                });
                Swal('Operación completa', resOk.data.msg);
                history.push('/users');
        })
        .catch(err => {
            if(!err.response){
                Toast('Error de conexión con el servidor', 'error');
            }
            else if(err.response.data.msg){
                Toast(err.response.data.msg, 'warning');
            }
            else if(err.response.data.errors){
                Toast(err.response.data.errors[0].msg, 'warning');
            }
        })
    }
    const modificarRol = async (rol) => {
        clienteAxios.put(`/api/roles/update/${rol.RoleId}`, rol)
        .then(resOk => {
            if (resOk.data)
                dispatch({
                    type: TYPES.MODIFICAR_ROL,
                    payload: rol
                })
                Swal('Operación completa', resOk.data.msg);
                history.push('/roles');
        })
        .catch(err => {
            if(!err.response){
                Toast('Error de conexión con el servidor', 'error');
            }
            else if(err.response.data.msg){
                Toast(err.response.data.msg, 'warning');
            }
            else if(err.response.data.errors){
                Toast(err.response.data.errors[0].msg, 'warning');
            }
        })
    }
    const eliminarRol = async (rol) => {
        clienteAxios.put(`/api/roles/delete/${rol.RoleId}`, rol)
        .then(resOk => {
            if (resOk.data)
                dispatch({
                    type: TYPES.ELIMINAR_USUARIO,
                    payload: rol
                })
                Swal('Operación completa', resOk.data.msg);
        })
        .catch(err => {
            if(!err.response){
                Toast('Error de conexión con el servidor', 'error');
            }
            else if(err.response.data.msg){
                Toast(err.response.data.msg, 'warning');
            }
            else if(err.response.data.errors){
                Toast(err.response.data.errors[0].msg, 'warning');
            }
        })
    }
    const traerUsuarios = async (estadoId = 0) => {
        try {
            const resultado =  await clienteAxios.get(`/api/usuarios/estado=${estadoId}`);
            dispatch({
                type: TYPES.LISTA_USUARIOS,
                payload: resultado.data
            })
        } catch (error) {
            console.log(error);
        }
    }
    const traerUsuariosPorRol = async (rolId = 0) => {
        try {
            const resultado =  await clienteAxios.get(`/api/usuarios/rol=${rolId}`);
            dispatch({
                type: TYPES.LISTA_USUARIOS,
                payload: resultado.data
            })
        } catch (error) {
            console.log(error);
        }
    }
    const traerRoles = async (estadoId = 0) => {
        try {
            const resultado =  await clienteAxios.get(`/api/roles`);
            dispatch({
                type: TYPES.LISTA_ROLES,
                payload: resultado.data
            })
        } catch (error) {
            console.log(error);
        }
    }
    const traerRolesPorUsuario = async (UserId) => {
        try {
            const resultado =  await clienteAxios.get(`/api/roles/${UserId}`);
            dispatch({
                type: TYPES.LISTA_ROLES_USER,
                payload: resultado.data
            })
        } catch (error) {
            console.log(error);
        }
    }
    const traerPermisos = async (estadoId = 0) => {
        try {
            const resultado =  await clienteAxios.get(`/api/permisos`);
            dispatch({
                type: TYPES.LISTA_PERMISOS,
                payload: resultado.data
            })
        } catch (error) {
            console.log(error);
        }
    }
    const traerPermisosPorRol = async (RoleId) => {
        try {
            const resultado =  await clienteAxios.get(`/api/permisos/${RoleId}`);
            dispatch({
                type: TYPES.LISTA_PERMISOS_ROL,
                payload: resultado.data
            })
        } catch (error) {
            console.log(error);
        }
    }

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
                Toast('Error de conexión con el servidor', 'error');
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
                history.goBack();
        })
        .catch(err => {
            if(!err.response){
                Toast('Error de conexión con el servidor', 'error');
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
        })
        .catch(err => {
            console.log(err.response.data.msg);
            if(!err.response){
                Toast('Error de conexión con el servidor', 'error');
            }
            else if(err.response.data.msg){
                Toast(err.response.data.msg, 'warning');
            }
            else if(err.response.data.errors){
                Toast(err.response.data.errors[0].msg, 'warning');
            }
        })
    }
    const cambioDomicilioAbonado = async(domicilio, setModalNuevoDomicilio) => {
        clienteAxios.put(`/api/usuarios/abonados/cambio-domicilio/${domicilio.UserId}`, domicilio)
        .then(resOk => {
            if (resOk.data)
                dispatch({
                    type: TYPES.CAMBIO_DOMICILIO_ABONADO,
                    payload: domicilio
                })
                Swal('Operación completa', resOk.data.msg);
                setModalNuevoDomicilio(false);
                window.location.reload();
        })
        .catch(err => {
            if(!err.response){
                Toast('Error de conexión con el servidor', 'error');
            }
            else if(err.response.data.msg){
                Toast(err.response.data.msg, 'warning');
            }
            else if(err.response.data.errors){
                Toast(err.response.data.errors[0].msg, 'warning');
            }
        })
    }
    const cambioServicioAbonado = async(servicio, setModalNuevoServicio) => {
        clienteAxios.put(`/api/usuarios/abonados/cambio-servicio/${servicio.UserId}`, servicio)
        .then(resOk => {
            if (resOk.data)
                dispatch({
                    type: TYPES.CAMBIO_SERVICIO_ABONADO,
                    payload: servicio
                })
                Swal('Operación completa', resOk.data.msg);
                setModalNuevoServicio(false);
                window.location.reload();
        })
        .catch(err => {
            if(!err.response){
                Toast('Error de conexión con el servidor', 'error');
            }
            else if(err.response.data.msg){
                Toast(err.response.data.msg, 'warning');
            }
            else if(err.response.data.errors){
                Toast(err.response.data.errors[0].msg, 'warning');
            }
        })
    }
    const cambioTitularidadAbonado = async(abonado) => {
        clienteAxios.put(`/api/usuarios/abonados/cambio-titularidad/${abonado.UserIdViejo}`, abonado)
        .then(resOk => {
            if (resOk.data)
                dispatch({
                    type: TYPES.CAMBIO_TITULARIDAD_ABONADO,
                    payload: abonado
                })
                Swal('Operación completa', resOk.data.msg);
                history.push('/abonados-activos');
        })
        .catch(err => {
            if(!err.response){
                Toast('Error de conexión con el servidor', 'error');
            }
            else if(err.response.data.msg){
                Toast(err.response.data.msg, 'warning');
            }
            else if(err.response.data.errors){
                Toast(err.response.data.errors[0].msg, 'warning');
            }
        })
    }
    const traerAbonados = async (estadoId = 0, municipioId = 0) => {
        try {
            const resultado =  await clienteAxios.get(`/api/usuarios/abonados/municipio=${municipioId}&estado=${estadoId}`);
            dispatch({
                type: TYPES.LISTA_ABONADOS,
                payload: resultado.data
            })
        } catch (error) {
            console.log(error);
        }
    }
    const traerAbonado = async (UserId) => {
        try {
            const resultado =  await clienteAxios.get(`/api/usuarios/abonados/UserId=${UserId}`);
            dispatch({
                type: TYPES.TRAER_ABONADO,
                payload: resultado.data
            })
        } catch (error) {
            console.log(error);
        }
    }
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
    const traerPagosPorAbonado = async (UserId, Periodo, Concepto) => {
        try {
            const resultado = await clienteAxios.get(`/api/pagos/UserId=${UserId}&Periodo=${Periodo}&Concepto=${Concepto}`);
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
    const eliminarDetallePago = async(detallePago, cerrarModal) => {
        clienteAxios.put('/api/detallesPago/delete', detallePago)
        .then(resOk => {
            if (resOk.data)
                dispatch({
                    type: TYPES.ELIMINAR_DETALLE_PAGO,
                    payload: detallePago
                });
                Swal('Operación completa', resOk.data.msg);
                cerrarModal(true);
        })
        .catch(err => {
            if(!err.response){
                Toast('Error de conexión con el servidor', 'error');
            }
            else if(err.response.data.msg){
                Toast(err.response.data.msg, 'warning');
            }
            else if(err.response.data.errors){
                Toast(err.response.data.errors[0].msg, 'warning');
            }
        })
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
                console.log(err);
                Toast('Error de conexión con el servidor', 'error');
            }
            else if(err.response.data.msg){
                Toast(err.response.data.msg, 'warning');
            }
            else if(err.response.data.errors){
                Toast(err.response.data.errors[0].msg, 'warning');
            }
        })
    }
    const agregarRecargo = async(pago, setModalRecargo) => {
        clienteAxios.put('/api/pagos/recargo', pago)
        .then(resOk => {
            if (resOk.data)
                dispatch({
                    type: TYPES.AGREGAR_RECARGO,
                    payload: pago
                });
                Swal('Operación completa', resOk.data.msg);
                setModalRecargo(false);
        })
        .catch(err => {
            if(!err.response){
                console.log(err);
                Toast('Error de conexión con el servidor', 'error');
            }
            else if(err.response.data.msg){
                Toast(err.response.data.msg, 'warning');
            }
            else if(err.response.data.errors){
                Toast(err.response.data.errors[0].msg, 'warning');
            }
        })
    }
    const eliminarRecargo = async(pago) => {
        clienteAxios.put('/api/pagos/recargo/delete', pago)
        .then(resOk => {
            if (resOk.data)
                dispatch({
                    type: TYPES.ELIMINAR_RECARGO,
                    payload: pago
                });
                Swal('Operación completa', resOk.data.msg);
        })
        .catch(err => {
            if(!err.response){
                console.log(err);
                Toast('Error de conexión con el servidor', 'error');
            }
            else if(err.response.data.msg){
                Toast(err.response.data.msg, 'warning');
            }
            else if(err.response.data.errors){
                Toast(err.response.data.errors[0].msg, 'warning');
            }
        })
    }
    const agregarCuota = async(pago, detallesPago, MunicipioId, setModalAgregarCuota) => {
        const pagoCompleto = {...pago, ...detallesPago, MunicipioId};
        clienteAxios.put('/api/pagos/cuota', pagoCompleto)
        .then(resOk => {
            if (resOk.data)
                dispatch({
                    type: TYPES.AGREGAR_CUOTA,
                    payload: pagoCompleto
                });
                Swal('Operación completa', resOk.data.msg);
                window.location.reload();
        })
        .catch(err => {
            if(!err.response){
                console.log(err);
                Toast('Error de conexión con el servidor', 'error');
            }
            else if(err.response.data.msg){
                Toast(err.response.data.msg, 'warning');
            }
            else if(err.response.data.errors){
                Toast(err.response.data.errors[0].msg, 'warning');
            }
        })
    }
    const traerDatosInscripcion = async(UserId) => {
        try {
            const resultado = await clienteAxios.get(`/api/pagos/UserId=${UserId}&Inscripcion=${true}`);
            dispatch({
                type: TYPES.DATOS_INSCRIPCION,
                payload: resultado.data
            })
        } catch (error) {
            console.log(error);
        }
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
                Toast('Error de conexión con el servidor', 'error');
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
                Toast('Error de conexión con el servidor', 'error');
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
                Toast('Error de conexión con el servidor', 'error');
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
                Toast('Error de conexión con el servidor', 'error');
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
                Toast('Error de conexión con el servidor', 'error');
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
                Toast('Error de conexión con el servidor', 'error');
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
                Toast('Error de conexión con el servidor', 'error');
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
                Toast('Error de conexión con el servidor', 'error');
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
                Toast('Error de conexión con el servidor', 'error');
            }
            else if(err.response.data.msg){
                Toast(err.response.data.msg, 'warning');
            }
            else if(err.response.data.errors){
                Toast(err.response.data.errors[0].msg, 'warning');
            }
        })
    }
    //ONUS
    const traerOnus = async (estadoId = 0) => {
        try {
            const resultado = await clienteAxios.get(`/api/onus/estado=${estadoId}`);
            dispatch({
                type: TYPES.LISTA_ONUS,
                payload: resultado.data
            });
        } catch (error) {
            console.log(error);
        }
    };
    const traerONUPorId = async (id) => {
        try {
            const resultado = await clienteAxios.get(`/api/onus/${id}`);
            dispatch({
                type: TYPES.TRAER_ONU,
                payload: resultado.data
            });
        } catch (error) {
            console.log(error);
        }
    };
    const crearONU = async(onu, cerrarModal) => {
        clienteAxios.post('/api/onus/create', onu)
        .then(resOk => {
            if (resOk.data)
                dispatch({
                    type: TYPES.CREAR_ONU,
                    payload: onu
                });
                Swal('Operación completa', resOk.data.msg);
                cerrarModal(true);
                window.location.reload();
        })
        .catch(err => {
            if(!err.response){
                Toast('Error de conexión con el servidor', 'error');
            }
            else if(err.response.data.msg){
                Toast(err.response.data.msg, 'warning');
            }
            else if(err.response.data.errors){
                Toast(err.response.data.errors[0].msg, 'warning');
            }
        })
    }
    const modificarONU = async(onu, cerrarModal) => {
        clienteAxios.put('/api/onus/update', onu)
        .then(resOk => {
            if (resOk.data)
                dispatch({
                    type: TYPES.EDITAR_ONU,
                    payload: onu
                });
                Swal('Operación completa', resOk.data.msg);
                cerrarModal(true);
        })
        .catch(err => {
            if(!err.response){
                Toast('Error de conexión con el servidor', 'error');
            }
            else if(err.response.data.msg){
                Toast(err.response.data.msg, 'warning');
            }
            else if(err.response.data.errors){
                Toast(err.response.data.errors[0].msg, 'warning');
            }
        })
    }
    const eliminarONU = async(onu, cerrarModal) => {
        clienteAxios.put('/api/onus/delete', onu)
        .then(resOk => {
            if (resOk.data)
                dispatch({
                    type: TYPES.ELIMINAR_ONU,
                    payload: onu
                });
                Swal('Operación completa', resOk.data.msg);
                cerrarModal(true);
        })
        .catch(err => {
            if(!err.response){
                Toast('Error de conexión con el servidor', 'error');
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
            const resultado = await clienteAxios.get('/api/modelosONU');
            dispatch({
                type: TYPES.LISTA_MODELOS_ONU,
                payload: resultado.data
            })
        } catch (error) {
            console.log(error);
        }
    }
    const crearModeloONU = async(modeloONU, cerrarModal) => {
        clienteAxios.post('/api/modelosONU/create', modeloONU)
        .then(resOk => {
            if (resOk.data)
                dispatch({
                    type: TYPES.CREAR_MODELO_ONU,
                    payload: modeloONU
                });
                Swal('Operación completa', resOk.data.msg);
                cerrarModal(true);
        })
        .catch(err => {
            if(!err.response){
                Toast('Error de conexión con el servidor', 'error');
            }
            else if(err.response.data.msg){
                Toast(err.response.data.msg, 'warning');
            }
            else if(err.response.data.errors){
                Toast(err.response.data.errors[0].msg, 'warning');
            }
        })
    }
    const modificarModeloONU = async(modeloOnu, cerrarModal) => {
        clienteAxios.put('/api/modelosONU/update', modeloOnu)
        .then(resOk => {
            if (resOk.data)
                dispatch({
                    type: TYPES.EDITAR_MODELO_ONU,
                    payload: modeloOnu
                });
                Swal('Operación completa', resOk.data.msg);
                cerrarModal(true);
        })
        .catch(err => {
            if(!err.response){
                Toast('Error de conexión con el servidor', 'error');
            }
            else if(err.response.data.msg){
                Toast(err.response.data.msg, 'warning');
            }
            else if(err.response.data.errors){
                Toast(err.response.data.errors[0].msg, 'warning');
            }
        })
    }
    const eliminarModeloONU = async(modeloOnu, cerrarModal) => {
        clienteAxios.put('/api/modelosONU/delete', modeloOnu)
        .then(resOk => {
            if (resOk.data)
                dispatch({
                    type: TYPES.ELIMINAR_MODELO_ONU,
                    payload: modeloOnu
                });
                Swal('Operación completa', resOk.data.msg);
                cerrarModal(true);
        })
        .catch(err => {
            if(!err.response){
                Toast('Error de conexión con el servidor', 'error');
            }
            else if(err.response.data.msg){
                Toast(err.response.data.msg, 'warning');
            }
            else if(err.response.data.errors){
                Toast(err.response.data.errors[0].msg, 'warning');
            }
        })
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
    const crearMedioPago = async(medioPago, cerrarModal) => {
        clienteAxios.post('/api/mediosPago/create', medioPago)
        .then(resOk => {
            if (resOk.data)
                dispatch({
                    type: TYPES.CREAR_MEDIO_DE_PAGO,
                    payload: medioPago
                });
                Swal('Operación completa', resOk.data.msg);
                cerrarModal(true);
        })
        .catch(err => {
            if(!err.response){
                Toast('Error de conexión con el servidor', 'error');
            }
            else if(err.response.data.msg){
                Toast(err.response.data.msg, 'warning');
            }
            else if(err.response.data.errors){
                Toast(err.response.data.errors[0].msg, 'warning');
            }
        })
    }
    const modificarMedioPago = async(medioPago, cerrarModal) => {
        clienteAxios.put('/api/mediosPago/update', medioPago)
        .then(resOk => {
            if (resOk.data)
                dispatch({
                    type: TYPES.EDITAR_MEDIO_DE_PAGO,
                    payload: medioPago
                });
                Swal('Operación completa', resOk.data.msg);
                cerrarModal(true);
        })
        .catch(err => {
            if(!err.response){
                Toast('Error de conexión con el servidor', 'error');
            }
            else if(err.response.data.msg){
                Toast(err.response.data.msg, 'warning');
            }
            else if(err.response.data.errors){
                Toast(err.response.data.errors[0].msg, 'warning');
            }
        })
    }
    const eliminarMedioPago = async(medioPago, cerrarModal) => {
        clienteAxios.put('/api/mediosPago/delete', medioPago)
        .then(resOk => {
            if (resOk.data)
                dispatch({
                    type: TYPES.ELIMINAR_MEDIO_DE_PAGO,
                    payload: medioPago
                });
                Swal('Operación completa', resOk.data.msg);
                cerrarModal(true);
        })
        .catch(err => {
            if(!err.response){
                Toast('Error de conexión con el servidor', 'error');
            }
            else if(err.response.data.msg){
                Toast(err.response.data.msg, 'warning');
            }
            else if(err.response.data.errors){
                Toast(err.response.data.errors[0].msg, 'warning');
            }
        })
    }
    //TAREAS
    const traerTareas = async () => {
        try {
            const resultado = await clienteAxios.get('/api/tareas');
            dispatch({
                type: TYPES.LISTA_TAREAS,
                payload: resultado.data
            })
        } catch (error) {
            console.log(error);
        }
    }
    const crearTarea = async(tarea, cerrarModal) => {
        clienteAxios.post('/api/tareas/create', tarea)
        .then(resOk => {
            if (resOk.data)
                dispatch({
                    type: TYPES.CREAR_TAREA,
                    payload: tarea
                });
                Swal('Operación completa', resOk.data.msg);
                cerrarModal(true);
        })
        .catch(err => {
            if(!err.response){
                Toast('Error de conexión con el servidor', 'error');
            }
            else if(err.response.data.msg){
                Toast(err.response.data.msg, 'warning');
            }
            else if(err.response.data.errors){
                Toast(err.response.data.errors[0].msg, 'warning');
            }
        })
    }
    const modificarTarea = async(tarea, cerrarModal) => {
        clienteAxios.put('/api/tareas/update', tarea)
        .then(resOk => {
            if (resOk.data)
                dispatch({
                    type: TYPES.EDITAR_TAREA,
                    payload: tarea
                });
                Swal('Operación completa', resOk.data.msg);
                cerrarModal(true);
        })
        .catch(err => {
            if(!err.response){
                Toast('Error de conexión con el servidor', 'error');
            }
            else if(err.response.data.msg){
                Toast(err.response.data.msg, 'warning');
            }
            else if(err.response.data.errors){
                Toast(err.response.data.errors[0].msg, 'warning');
            }
        })
    }
    const eliminarTarea = async(tarea, cerrarModal) => {
        clienteAxios.put('/api/tareas/delete', tarea)
        .then(resOk => {
            if (resOk.data)
                dispatch({
                    type: TYPES.ELIMINAR_TAREA,
                    payload: tarea
                });
                Swal('Operación completa', resOk.data.msg);
                cerrarModal(true);
        })
        .catch(err => {
            if(!err.response){
                Toast('Error de conexión con el servidor', 'error');
            }
            else if(err.response.data.msg){
                Toast(err.response.data.msg, 'warning');
            }
            else if(err.response.data.errors){
                Toast(err.response.data.errors[0].msg, 'warning');
            }
        })
    }
    //OT
    const traerOrdenesDeTrabajo = async (estadoId) => {
        try {
            const resultado = await clienteAxios.get(`/api/ot/estado=${estadoId}`);
            dispatch({
                type: TYPES.LISTA_OT,
                payload: resultado.data
            })
        } catch (error) {
            console.log(error);
        }
    }
    const traerOrdenesDeTrabajoAsignadas = async (tecnicoId, estadoId) => {
        try {
            const resultado = await clienteAxios.get(`/api/ot/tecnico=${tecnicoId}&estado=${estadoId}`);
            dispatch({
                type: TYPES.LISTA_OT_ASIGNADAS,
                payload: resultado.data
            })
        } catch (error) {
            console.log(error);
        }
    }
    const traerTecnicosOt = async (ot) => {
        try {
            const resultado = await clienteAxios.get(`/api/ot/tecnicos/${ot}`);
            dispatch({
                type: TYPES.LISTA_TECNICOS_OT,
                payload: resultado.data
            })
        } catch (error) {
            console.log(error);
        }
    }
    const traerTareasOt = async (ot) => {
        try {
            const resultado = await clienteAxios.get(`/api/ot/tareas/${ot}`);
            dispatch({
                type: TYPES.LISTA_TAREAS_OT,
                payload: resultado.data
            })
        } catch (error) {
            console.log(error);
        }
    }
    const crearOrdenDeTrabajo = async (ot) => {
        clienteAxios.post('/api/ot/create', ot)
        .then(resOk => {
            if (resOk.data)
                dispatch({
                    payload: ot
                });
                Swal('Operación completa', resOk.data.msg);
                history.push('/ot-pendientes');
        })
        .catch(err => {
            if(!err.response){
                Toast('Error de conexión con el servidor', 'error');
            }
            else if(err.response.data.msg){
                Toast(err.response.data.msg, 'warning');
            }
            else if(err.response.data.errors){
                Toast(err.response.data.errors[0].msg, 'warning');
            }
        })
    }
    const registrarVisitaOrdenDeTrabajo = async (ot, cerrarModal) => {
        clienteAxios.put('/api/ot/registrar-visita', ot)
        .then(resOk => {
            if (resOk.data)
                dispatch({
                    payload: ot,
                    type: TYPES.REGISTRAR_VISITA_OT
                });
                Swal('Operación completa', resOk.data.msg);
                // cerrarModal(true);
                // window.location.reload();
        })
        .catch(err => {
            if(!err.response){
                Toast('Error de conexión con el servidor', 'error');
            }
            else if(err.response.data.msg){
                Toast(err.response.data.msg, 'warning');
            }
            else if(err.response.data.errors){
                Toast(err.response.data.errors[0].msg, 'warning');
            }
        })
    }

    const finalizarOrdenDeTrabajo = async (ot, cerrarModal) => {
        clienteAxios.put('/api/ot/finalizar-ot', ot)
        .then(resOk => {
            if (resOk.data)
                dispatch({
                    type: TYPES.FINALIZAR_OT,
                    payload: ot
                });
                Swal('Operación completa', resOk.data.msg);
                cerrarModal(true);
        })
        .catch(err => {
            if(!err.response){
                Toast('Error de conexión con el servidor', 'error');
            }
            else if(err.response.data.msg){
                Toast(err.response.data.msg, 'warning');
            }
            else if(err.response.data.errors){
                Toast(err.response.data.errors[0].msg, 'warning');
            }
        })
    }

    const modificarOrdenDeTrabajo = async (ot) => {
        clienteAxios.put('/api/ot/update', ot)
        .then(resOk => {
            if (resOk.data)
                dispatch({
                    payload: ot
                });
                Swal('Operación completa', resOk.data.msg);
                history.push('/ot-pendientes')
        })
        .catch(err => {
            if(!err.response){
                Toast('Error de conexión con el servidor', 'error');
            }
            else if(err.response.data.msg){
                Toast(err.response.data.msg, 'warning');
            }
            else if(err.response.data.errors){
                Toast(err.response.data.errors[0].msg, 'warning');
            }
        })
    }

    const eliminarOrdenDeTrabajo = async (ot) => {
        clienteAxios.put('/api/ot/delete', ot)
        .then(resOk => {
            if (resOk.data)
                dispatch({
                    payload: ot
                });
                Swal('Operación completa', resOk.data.msg);
        })
        .catch(err => {
            if(!err.response){
                Toast('Error de conexión con el servidor', 'error');
            }
            else if(err.response.data.msg){
                Toast(err.response.data.msg, 'warning');
            }
            else if(err.response.data.errors){
                Toast(err.response.data.errors[0].msg, 'warning');
            }
        })
    }
    //movimientos
    const traerMovimientosPorFecha = async (Fecha) => {
        try {
            const resultado = await clienteAxios.get(`/api/movimientos/Dia=${Fecha.getDate()}&Mes=${Fecha.getMonth()+1}&Anio=${Fecha.getFullYear()}`);
            dispatch({
                type: TYPES.LISTA_MOVIMIENTOS,
                payload: resultado.data
            })
        } catch (error) {
            console.log(error);
        }
    }
    //conceptos de movimientos
    const traerConceptos = async (tipo) => {
        try {
            const resultado = await clienteAxios.get(`/api/conceptos/${tipo}`);
            dispatch({
                type: TYPES.LISTA_CONCEPTOS,
                payload: resultado.data
            })
        } catch (error) {
            console.log(error);
        }
    }
    return(
        <AppContext.Provider
        value={{
            token: state.token,
            usuario: state.usuario,
            usuarioLogueado: state.usuarioLogueado,
            usuarioAutenticado: state.usuarioAutenticado,
            push: state.push,
            usuarios: state.usuarios,
            roles: state.roles,
            rolesUser: state.rolesUser,
            permisos: state.permisos,
            permisosRol: state.permisosRol,
            abonados: state.abonados,
            abonado: state.abonado,
            domicilios: state.domicilios,
            barrios: state.barrios,
            condicionesIva: state.condicionesIva,
            municipios: state.municipios,
            provincias: state.provincias,
            servicios: state.servicios,
            onu: state.onu,
            onus: state.onus,
            modelosONU: state.modelosONU,
            historialDomicilios: state.historialDomicilios,
            historialServicios: state.historialServicios,
            mediosPago: state.mediosPago,
            pagos: state.pagos,
            inscripcion: state.inscripcion,
            detallesPago: state.detallesPago,
            tareas: state.tareas,
            ordenesDeTrabajo: state.ordenesDeTrabajo,
            ordenesDeTrabajoAsignadas: state.ordenesDeTrabajoAsignadas,
            tecnicosOrdenDeTrabajo: state.tecnicosOrdenDeTrabajo,
            tareasOrdenDeTrabajo: state.tareasOrdenDeTrabajo,
            movimientos: state.movimientos,
            conceptos: state.conceptos,
            iniciarSesion, cerrarSesion, obtenerUsuarioAutenticado, traerUsuarios, traerUsuariosPorRol, crearUsuario, modificarUsuario, eliminarUsuario,
            traerRoles, traerRolesPorUsuario, crearRol, modificarRol, eliminarRol,
            traerPermisos, traerPermisosPorRol,
            traerAbonados, traerAbonado, traerDomiciliosAbonado, traerServiciosAbonado, crearAbonado, modificarAbonado, cambioTitularidadAbonado,
            cambioDomicilioAbonado, cambiarEstadoAbonado, cambioServicioAbonado,
            traerBarriosPorMunicipio, crearBarrio, modificarBarrio, eliminarBarrio, 
            traerCondicionesIva,
            traerMunicipios, traerMunicipiosPorProvincia, crearMunicipio, modificarMunicipio, eliminarMunicipio,
            traerProvincias,
            traerServicios, crearServicio, modificarServicio, eliminarServicio,
            traerOnus, traerONUPorId, crearONU, modificarONU, eliminarONU,
            traerModelosONU, crearModeloONU, modificarModeloONU, eliminarModeloONU,
            traerMediosPago, crearMedioPago, modificarMedioPago, eliminarMedioPago,
            traerPagosPorAbonado, crearPago, agregarRecargo, eliminarRecargo, traerDatosInscripcion, agregarCuota,
            traerDetallesPago, eliminarDetallePago,
            traerTareas, crearTarea, modificarTarea, eliminarTarea,
            traerOrdenesDeTrabajo, traerOrdenesDeTrabajoAsignadas, traerTecnicosOt, traerTareasOt, crearOrdenDeTrabajo, modificarOrdenDeTrabajo,
            finalizarOrdenDeTrabajo, registrarVisitaOrdenDeTrabajo, eliminarOrdenDeTrabajo,
            traerMovimientosPorFecha,
            traerConceptos
        }}>{props.children}
        </AppContext.Provider>
    )
};
export default AppState;