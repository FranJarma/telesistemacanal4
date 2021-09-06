import {LISTA_PROVINCIAS} from '../../types';

// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
    switch (action.type) {
        case LISTA_PROVINCIAS:
            return {
                ...state,
                provincias: action.payload,
            };    
        default:
            return state;
    }
};