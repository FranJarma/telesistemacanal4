import React from 'react';
import './styles/styles.css';

const Footer = () => {
    return (
        <footer className="footer">
            <span><b>Telesistema Canal 4 © {new Date().getFullYear()} </b><i>| Todos los derechos reservados</i></span>
        </footer> );
}
 
export default Footer;