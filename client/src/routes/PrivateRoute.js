import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...props }) => {
    return (
        <Route {...props } render = { props => !sessionStorage.getItem('token') ? (
            <Redirect to="/"/>
        ) : (
            <Component {...props}/>
        )}/>
    
    );
}

export default PrivateRoute;