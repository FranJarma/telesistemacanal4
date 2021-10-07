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

    const onClickCollapsed = () => {
      setCollapsed(!Collapsed);
    }
    const onClickMenuAbonados = () => {
      setSubMenuAbonados(!SubMenuAbonados);
      setSubMenuTecnicos(false);
      setSubMenuUsuarios(false);
    }
    const onClickMenuTecnicos = () => {
      setSubMenuTecnicos(!SubMenuTecnicos);
      setSubMenuAbonados(false);
      setSubMenuUsuarios(false);
    }
    const onClickMenuUsuarios = () => {
      setSubMenuUsuarios(!SubMenuUsuarios);
      setSubMenuAbonados(false);
      setSubMenuTecnicos(false);
    }
    return (   
    <>
    <ProSidebar collapsed={Collapsed} breakPoint="md">
      <Menu iconShape="square">
        <SidebarHeader>
        <div
          style={{
            padding: '24px',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            fontSize: 14,
            letterSpacing: '1px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
        Bienvenido
        </div>
        </SidebarHeader>
        <MenuItem icon={<i className="bx bx-home"></i>}>Inicio<Link to="/home"></Link></MenuItem>
        <SubMenu onClick={onClickMenuAbonados} open={SubMenuAbonados} title="Abonados" icon={<i className="bx bx-user"></i>}>
          <MenuItem icon={<i class='bx bxs-user-detail' ></i>}>Inscriptos<Link to="/abonados-inscriptos"></Link></MenuItem>
          <MenuItem icon={<i class='bx bx-user-check' ></i>}>Activos<Link to="/abonados-activos"></Link></MenuItem>
          <MenuItem icon={<i class='bx bx-user-x' ></i>}>Inactivos<Link to="/abonados-inactivos"></Link></MenuItem>
        </SubMenu>
        <SubMenu onClick={onClickMenuTecnicos} open={SubMenuTecnicos} title="Técnicos y cobradores" icon={<i className="bx bx-wrench"></i>}>
          <MenuItem icon={<i class='bx bx-wifi-off'></i>}>Cortes a realizar<Link to="/cortes"></Link></MenuItem>
          <MenuItem icon={<i class='bx bxs-plug'></i>}>Bajadas a realizar<Link to="/bajadas"></Link></MenuItem>
          <MenuItem icon={<i class='bx bx-dollar' ></i>}>Cobros en domiclio<Link to="/cobros"></Link></MenuItem>
        </SubMenu>
        <SubMenu onClick={onClickMenuUsuarios} open={SubMenuUsuarios} title="Usuarios" icon={<i className="bx bx-group"></i>}>
          <MenuItem icon={<i class='bx bxs-user'></i>}>Usuarios<Link to="/usuarios"></Link></MenuItem>
          <MenuItem icon={<i class='bx bxs-user-account'></i>}>Roles<Link to="/roles"></Link></MenuItem>
        </SubMenu>
        <MenuItem icon={<i className="bx bx-broadcast"></i>}>ONUS<Link to="/onus"></Link></MenuItem>
        <SidebarFooter style={{ textAlign: 'center' }}>
        <div
          className="sidebar-btn-wrapper"
          style={{
            padding: '20px 24px',
          }}
        >
            <span style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              <img alt="" src={logo2}/>
            </span>
        </div>
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