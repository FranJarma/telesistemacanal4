import * as TYPES from '../types';
// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
    switch (action.type) {
        case TYPES.CREAR_USUARIO:
            return {
                ...state,
                usuarios: [action.payload, ...state.usuarios],
        }
        case TYPES.LISTA_USUARIOS: {
            return {
                ...state,
                usuarios: action.payload
            }
        }
        case TYPES.LISTA_ROLES: {
            return {
                ...state,
                roles: action.payload
            }
        }
        case TYPES.CAMBIO_DOMICILIO_ABONADO: {
            return {
                ...state,
                historialDomicilios: [action.payload, ...state.historialDomicilios]
            };
        }
        case TYPES.CAMBIO_SERVICIO_ABONADO: {
            return {
                ...state,
                historialServicios: [action.payload, ...state.historialServicios]
            };
        }
        case TYPES.CAMBIAR_ESTADO_ABONADO: {
            return {
                ...state,
                abonados: state.abonados.map(abonado => abonado.UserId === action.payload.UserId ? action.payload : abonado)
            };
        }
        case TYPES.LISTA_ABONADOS:
        case TYPES.LISTA_ABONADOS_INSCRIPTOS:
        case TYPES.LISTA_ABONADOS_ACTIVOS:
        case TYPES.LISTA_ABONADOS_INACTIVOS:
            return {
                ...state,
                abonados: action.payload,
        }
        case TYPES.LISTA_DOMICILIOS_ABONADO: 
            return {
                ...state,
                historialDomicilios: action.payload
            }
        case TYPES.LISTA_SERVICIOS_ABONADO: 
            return {
                ...state,
                historialServicios: action.payload
        }
        case TYPES.LISTA_BARRIOS:
            return {
                ...state,
                barrios: action.payload,
        }
        case TYPES.CREAR_BARRIO:
            return {
                ...state,
                barrios: [action.payload, ...state.barrios],
        }
        case TYPES.EDITAR_BARRIO:
            return {
                ...state,
                barrios: state.barrios.map(barrio => barrio.BarrioId === action.payload.BarrioId ? action.payload : barrio),
        } 
        case TYPES.ELIMINAR_BARRIO:
            return {
                ...state,
                barrios: state.barrios.filter(barrio => barrio.BarrioId !== action.payload.BarrioId),
        } 
        case TYPES.LISTA_CONDICIONES_IVA:
            return {
                ...state,
                condicionesIva: action.payload,
        }
        case TYPES.LISTA_MUNICIPIOS:
            return {
                ...state,
                municipios: action.payload,
        }
        case TYPES.CREAR_MUNICIPIO:
            return {
                ...state,
                municipios: [action.payload, ...state.municipios],
        }
        case TYPES.EDITAR_MUNICIPIO:
            return {
                ...state,
                municipios: state.municipios.map(servicio => servicio.MunicipioId === action.payload.MunicipioId ? action.payload : servicio),
        } 
        case TYPES.ELIMINAR_MUNICIPIO:
            return {
                ...state,
                municipios: state.municipios.filter(servicio => servicio.MunicipioId !== action.payload.MunicipioId),
        } 
        case TYPES.LISTA_PROVINCIAS:
            return {
                ...state,
                provincias: action.payload,
        }
        case TYPES.LISTA_SERVICIOS:
            return {
                ...state,
                servicios: action.payload,
        }
        case TYPES.CREAR_SERVICIO:
            return {
                ...state,
                servicios: [action.payload, ...state.servicios],
        }
        case TYPES.EDITAR_SERVICIO:
            return {
                ...state,
                servicios: state.servicios.map(servicio => servicio.ServicioId === action.payload.ServicioId ? action.payload : servicio),
        } 
        case TYPES.ELIMINAR_SERVICIO:
            return {
                ...state,
                servicios: state.servicios.filter(servicio => servicio.ServicioId !== action.payload.ServicioId),
        } 
        case TYPES.TRAER_ONU:
            return {
                ...state,
                onu: action.payload
        }
        case TYPES.LISTA_ONUS:
            return {
                ...state,
                onus: action.payload
        }
        case TYPES.CREAR_ONU:
            return {
                ...state,
                onus: [action.payload, ...state.onus],
        }
        case TYPES.EDITAR_ONU:
            return {
                ...state,
                onus: state.onus.map(onu => onu.OnuId === action.payload.OnuId ? action.payload : onu),
        } 
        case TYPES.ELIMINAR_ONU:
            return {
                ...state,
                onus: state.onus.filter(onu => onu.OnuId !== action.payload.OnuId),
        } 
        case TYPES.LISTA_MODELOS_ONU:
            return {
                ...state,
                modelosONU: action.payload
        }
        case TYPES.CREAR_MODELO_ONU:
            return {
                ...state,
                modelosONU: [action.payload, ...state.modelosONU],
        }
        case TYPES.EDITAR_MODELO_ONU:
            return {
                ...state,
                modelosONU: state.modelosONU.map(modeloONU => modeloONU.ModeloOnuId === action.payload.ModeloOnuId ? action.payload : modeloONU),
        } 
        case TYPES.ELIMINAR_MODELO_ONU:
            return {
                ...state,
                modelosONU: state.modelosONU.filter(modeloONU => modeloONU.ModeloOnuId !== action.payload.ModeloOnuId),
        } 
        case TYPES.LISTA_MEDIOS_DE_PAGO:
            return {
                ...state,
                mediosPago: action.payload
        }
        case TYPES.LISTA_PAGOS_ABONADO:
            return {
                ...state,
                pagos: action.payload
        }
        case TYPES.TRAER_PAGO:
            return {
                ...state,
                pago: action.payload
        }
        case TYPES.LISTA_DETALLES_PAGO_ABONADO:
            return {
                ...state,
                detallesPago: action.payload
        }
        case TYPES.ELIMINAR_DETALLE_PAGO:
            const pago = state.pagos.find(pago => pago.PagoId === action.payload.PagoId);
            pago.PagoSaldo = pago.PagoSaldo + action.payload.DetallePagoMonto;
            return {
                ...state,
                detallesPago: state.detallesPago.filter(detallePago => detallePago.DetallePagoId !== action.payload.DetallePagoId),
                pagos: [...state.pagos]

        } 
        default:
            return state;
    }
};