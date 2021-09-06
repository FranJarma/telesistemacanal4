import {LISTA_MUNICIPIOS} from '../../types';

// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
    switch (action.type) {
        case LISTA_MUNICIPIOS:
            return {
                ...state,
                municipios: action.payload,
            };    
        default:
            return state;
    }
};