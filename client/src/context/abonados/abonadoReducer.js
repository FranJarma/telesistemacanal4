import {CREAR_ABONADO, LISTA_ABONADOS_ACTIVOS} from '../../types';

// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
    switch (action.type) {
        case CREAR_ABONADO: {
            return {
                ...state,
                errorFormulario: state.errorFormulario,
                abonados: [...state.abonados, action.payload]
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