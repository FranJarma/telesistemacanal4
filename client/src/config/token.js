import clienteAxios from './axios';

const tokenAuthHeaders = token => {
    if (token){
        //en caso de que haya un token, lo vamos a pasar por el header
        clienteAxios.defaults.headers.common['x-auth-token'] = token;
    }
    else{
        //en caso de que no, lo eliminamos
        clienteAxios.defaults.headers.common['x-auth-token'] = "";
    }
};
export default tokenAuthHeaders;