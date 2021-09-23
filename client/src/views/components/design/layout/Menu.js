import React from 'react';
import { Link } from 'react-router-dom';
import logo2 from './../../../images/logo2.png';

const MenuAside = () => {
    return ( 
      <ul className="nav-links">
      <li>
        <Link to="/">
          <i className='bx bx-home' ></i>
          <span className="link_name">Inicio</span>
        </Link>
        <ul className="sub-menu blank">
          <li><Link className="link_name" to="/">Inicio</Link></li>
        </ul>
      </li>
      <li>
        <div className="iocn-link">
          <a>
          <i className='bx bx-user' ></i>
          <span className="link_name">Abonados</span>
          </a>
          <i className='bx bxs-chevron-down arrow' ></i>
        </div>
        <ul className="sub-menu">
          <li><a className="link_name">Abonados</a></li>
          <li><Link to="/abonados-activos">Activos</Link></li>
          <li><Link to="/abonados-inactivos">Inactivos</Link></li>
          <li><Link to="/caratula-abonado">Nuevo abonado</Link></li>

        </ul>
      </li>
      <li>
        <div className="iocn-link">
          <a>
          <i className='bx bxs-wrench'></i>
          <span className="link_name">Técnicos</span>
          </a>
          <i className='bx bxs-chevron-down arrow' ></i>
        </div>
        <ul className="sub-menu">
        <li><a className="link_name">Técnicos</a></li>
          <li><Link to="/">Asignados</Link></li>
          <li><Link to="/">No Asignados</Link></li>
          <li><Link to="/">Nuevo técnico</Link></li>
        </ul>
      </li>
      <li>
        <Link to="/">
          <i className='bx bx-pie-chart-alt-2' ></i>
          <span className="link_name">Estadísticas</span>
        </Link>
        <ul className="sub-menu blank">
          <li><Link className="link_name" to="/">Estadísticas</Link></li>
        </ul>
      </li>
      <li>
        <Link to="/">
          <i className='bx bx-cog' ></i>
          <span className="link_name">Mi cuenta</span>
        </Link>
        <ul className="sub-menu blank">
          <li><Link className="link_name" to="/">Mi cuenta</Link></li>
        </ul>
      </li>
      <li>
        <Link to="/">
          <i className='bx bx-log-out' ></i>
          <span className="link_name">Salir</span>
        </Link>
        <ul className="sub-menu blank">
          <li><Link className="link_name" to="/">Salir</Link></li>
        </ul>
      </li>
      <li>
    <div className="profile-details">
      <div className="profile-content">
        <img src={logo2} alt="logo"/>
      </div>
    </div>
  </li>
</ul>
);
}
 
export default MenuAside;