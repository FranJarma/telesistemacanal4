import {CREAR_ABONADO, LISTA_ABONADOS_ACTIVOS, MODIFICAR_ABONADO, DAR_DE_BAJA_ABONADO, CAMBIO_DOMICILIO_ABONADO, LISTA_ABONADOS_INACTIVOS,
LISTA_DOMICILIOS_ABONADOS, ULTIMO_DOMICILIO} from '../../types';

// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
    switch (action.type) {
        case CREAR_ABONADO:
        case MODIFICAR_ABONADO:
        case CAMBIO_DOMICILIO_ABONADO: {
            return {
                ...state,
            };
        }
        case DAR_DE_BAJA_ABONADO: {
            return {
                ...state,
                abonados: state.abonados.map(abonado => abonado.UserId === action.payload.idAbonadoBaja ? action.payload : abonado)
            };
        }
        case LISTA_ABONADOS_ACTIVOS:
        case LISTA_ABONADOS_INACTIVOS:
            return {
                ...state,
                abonados: action.payload,
            };
        case LISTA_DOMICILIOS_ABONADOS: 
            return {
                ...state,
                domicilios: action.payload
            }
        case ULTIMO_DOMICILIO: {
            return {
                ...state,
                domicilio: action.payload
            }
        }
        default:
            return state;
    }
};