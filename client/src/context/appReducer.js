import * as TYPES from '../types';
// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
    switch (action.type) {
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
        case TYPES.LISTA_MODELOS_ONU:
            return {
                ...state,
                modelosOnu: action.payload
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
        default:
            return state;
    }
};