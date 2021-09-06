import {LISTA_BARRIOS} from '../../types';

// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
    switch (action.type) {
        case LISTA_BARRIOS:
            return {
                ...state,
                barrios: action.payload,
            };    
        default:
            return state;
    }
};