import React, { useContext, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import AppContext from './../context/appContext';

const PrivateRoute = ({ component: Component, ...props }) => {
    const appContext = useContext(AppContext);
    const { usuarioAutenticado, obtenerUsuarioAutenticado } = appContext;
    
    useEffect(() => {
        obtenerUsuarioAutenticado();
    },[]);

    return (
        <Route {...props } render = { props => !usuarioAutenticado ? (
            <Redirect to="/"/>
        ) : (
            <Component {...props}/>
        )}/>
    
    );
}

export default PrivateRoute;