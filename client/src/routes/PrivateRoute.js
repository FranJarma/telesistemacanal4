import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...props }) => {
    return (
        <Route {...props } render = { props => !localStorage.getItem('token') ? (
            <Navigate to="/"/>
        ) : (
            <Component {...props}/>
        )}/>
    
    );
}

export default PrivateRoute;