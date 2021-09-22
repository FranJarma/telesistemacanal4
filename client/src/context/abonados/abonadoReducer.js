import {CREAR_ABONADO, LISTA_ABONADOS_ACTIVOS, MODIFICAR_ABONADO, DAR_DE_BAJA_ABONADO} from '../../types';

// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
    switch (action.type) {
        case CREAR_ABONADO: {
            return {
                ...state,
            };
        }
        case MODIFICAR_ABONADO: {
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
            return {
                ...state,
                abonados: action.payload,
            };    
        default:
            return state;
    }
};