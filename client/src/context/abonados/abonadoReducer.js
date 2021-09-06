import {LISTA_ABONADOS_ACTIVOS} from '../../types';

// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
    switch (action.type) {
        case LISTA_ABONADOS_ACTIVOS:
            return {
                ...state,
                abonados: action.payload,
            };    
        default:
            return state;
    }
};