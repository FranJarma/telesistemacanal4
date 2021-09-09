
import { MOSTRAR_ERROR} from '../../types';

export default (state, action) => {
    switch(action.type) {
        case MOSTRAR_ERROR:
            return {
                ...state,
                error: action.payload
            }
        default:
            return state;
    }
}