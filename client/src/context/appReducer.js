import * as TYPES from '../types';
// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
    switch (action.type) {
        case TYPES.CREAR_ABONADO:
        case TYPES.MODIFICAR_ABONADO:
        case TYPES.CAMBIO_DOMICILIO_ABONADO: {
            return {
                ...state,
            };
        }
        case TYPES.DAR_DE_BAJA_ABONADO: {
            return {
                ...state,
                abonados: state.abonados.map(abonado => abonado.UserId === action.payload.idAbonadoBaja ? action.payload : abonado)
            };
        }
        case TYPES.LISTA_ABONADOS_ACTIVOS:
        case TYPES.LISTA_ABONADOS_INACTIVOS:
            return {
                ...state,
                abonados: action.payload,
        }
        case TYPES.LISTA_DOMICILIOS_ABONADOS: 
            return {
                ...state,
                domicilios: action.payload
            }
        case TYPES.ULTIMO_DOMICILIO: {
            return {
                ...state,
                domicilio: action.payload
            }
        }
        case TYPES.LISTA_BARRIOS:
            return {
                ...state,
                barrios: action.payload,
        }
        case TYPES.LISTA_CONDICIONES_IVA:
            return {
                ...state,
                condicionesIVA: action.payload,
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
        default:
            return state;
    }
};