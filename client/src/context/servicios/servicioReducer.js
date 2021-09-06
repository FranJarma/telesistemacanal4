import {LISTA_SERVICIOS} from '../../types';

// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
    switch (action.type) {
        case LISTA_SERVICIOS:
            return {
                ...state,
                servicios: action.payload,
            };    
        default:
            return state;
    }
};