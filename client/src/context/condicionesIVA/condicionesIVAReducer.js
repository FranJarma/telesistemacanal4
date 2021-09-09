import {LISTA_CONDICIONES_IVA} from '../../types';

// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
    switch (action.type) {
        case LISTA_CONDICIONES_IVA:
            return {
                ...state,
                condicionesIVA: action.payload,
            };    
        default:
            return state;
    }
};