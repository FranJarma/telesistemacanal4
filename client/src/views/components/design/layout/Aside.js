import React, { useState } from 'react';
import { ProSidebar, Menu, MenuItem, SubMenu, SidebarHeader, SidebarFooter } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { Link } from 'react-router-dom';
import logo2 from './../../../images/logo2.png';

const Aside = () => {
    const [Collapsed, setCollapsed] = useState(false);
    const [SubMenuAbonados, setSubMenuAbonados] = useState(false);
    const [SubMenuTecnicos, setSubMenuTecnicos] = useState(false);
    const [SubMenuUsuarios, setSubMenuUsuarios] = useState(false);
    const [SubMenuAdministracion, setSubMenuAdministracion] = useState(false);

    const onClickCollapsed = () => {
      setCollapsed(!Collapsed);
    }
    const onClickMenuAbonados = () => {
      setSubMenuAbonados(!SubMenuAbonados);
      setSubMenuTecnicos(false);
      setSubMenuUsuarios(false);
      setSubMenuAdministracion(false);
    }
    const onClickMenuTecnicos = () => {
      setSubMenuTecnicos(!SubMenuTecnicos);
      setSubMenuAbonados(false);
      setSubMenuUsuarios(false);
      setSubMenuAdministracion(false);
    }
    const onClickMenuUsuarios = () => {
      setSubMenuUsuarios(!SubMenuUsuarios);
      setSubMenuAbonados(false);
      setSubMenuTecnicos(false);
      setSubMenuAdministracion(false);
    }
    const onClickMenuAdministracion = () => {
      setSubMenuAdministracion(!SubMenuAdministracion);
      setSubMenuAbonados(false);
      setSubMenuTecnicos(false);
      setSubMenuUsuarios(false);
    }
    return (   
    <>
    <ProSidebar collapsed={Collapsed} breakPoint="md">
    <img alt="" src={logo2}/>
      <Menu iconShape="square">
        <SidebarHeader>
        <div
          style={{
            paddingLeft: '24px',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            fontSize: 14,
            letterSpacing: '1px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
        Francisco Jarma
        </div>
        <div
          style={{
            paddingLeft: '24px',
            paddingBottom: '10px',
            fontSize: 11,
            letterSpacing: '1px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
        Mesa de entrada
        </div>
        </SidebarHeader>
        <MenuItem icon={<i className="bx bx-home"></i>}>Inicio<Link to="/home"></Link></MenuItem>
        <SubMenu onClick={onClickMenuAbonados} open={SubMenuAbonados} title="Abonados" icon={<i className="bx bx-user"></i>}>
          <MenuItem icon={<i className='bx bxs-user-detail' ></i>}>Inscriptos<Link to="/abonados-inscriptos"></Link></MenuItem>
          <MenuItem icon={<i className='bx bx-user-check' ></i>}>Activos<Link to="/abonados-activos"></Link></MenuItem>
          <MenuItem icon={<i className='bx bx-user-x' ></i>}>Inactivos<Link to="/abonados-inactivos"></Link></MenuItem>
        </SubMenu>
        <SubMenu onClick={onClickMenuTecnicos} open={SubMenuTecnicos} title="Técnicos y Cobradores" icon={<i className="bx bx-wrench"></i>}>
          <MenuItem icon={<i className='bx bx-wifi-off'></i>}>Cortes a realizar<Link to="/cortes"></Link></MenuItem>
          <MenuItem icon={<i className='bx bxs-plug'></i>}>Bajadas a realizar<Link to="/bajadas"></Link></MenuItem>
          <MenuItem icon={<i className='bx bx-dollar' ></i>}>Cobros en domiclio<Link to="/cobros"></Link></MenuItem>
        </SubMenu>
        <SubMenu onClick={onClickMenuUsuarios} open={SubMenuUsuarios} title="Usuarios" icon={<i className="bx bx-group"></i>}>
          <MenuItem icon={<i className='bx bxs-user'></i>}>Usuarios<Link to="/usuarios"></Link></MenuItem>
          <MenuItem icon={<i className='bx bxs-user-account'></i>}>Roles<Link to="/roles"></Link></MenuItem>
        </SubMenu>
        <SubMenu onClick={onClickMenuAdministracion} open={SubMenuAdministracion} title="Administración" icon={<i className="bx bxs-brightness"></i>}>
        <MenuItem icon={<i className="bx bx-plug"></i>}>Servicios<Link to="/servicios"></Link></MenuItem>
        <MenuItem icon={<i className="bx bx-map"></i>}>Barrios<Link to="/barrios"></Link></MenuItem>
        <MenuItem icon={<i className="bx bx-map-pin"></i>}>Municipios<Link to="/municipios"></Link></MenuItem>
        <MenuItem icon={<i className="bx bx-broadcast"></i>}>Onus<Link to="/onus"></Link></MenuItem>
        <MenuItem icon={<i className="bx bx-wallet"></i>}>Medios de Pago<Link to="/medios-de-pago"></Link></MenuItem>
        </SubMenu>
        <SidebarFooter>
        <MenuItem icon={<i className='bx bx-log-out-circle'></i>}>Salir<Link to="/"></Link></MenuItem>
      </SidebarFooter>
      </Menu>
    </ProSidebar>
    <div className="header">
        <i onClick={onClickCollapsed} className="bx bx-menu"/>
    </div>
  </>
  );
}
 
export default Aside;