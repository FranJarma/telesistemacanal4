import React, { useState, useContext, useEffect } from 'react';
import { ProSidebar, Menu, MenuItem, SubMenu, SidebarHeader, SidebarFooter } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { Link } from 'react-router-dom';
import logo2 from './../../../images/logo2.png';
import AppContext from '../../../../context/appContext';
import { Typography } from '@material-ui/core';

const Aside = () => {
    const appContext = useContext(AppContext);
    const { obtenerUsuarioAutenticado, usuarioLogueado, push, cerrarSesion } = appContext;
    
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
    useEffect(()=> {
      obtenerUsuarioAutenticado();
    },[]);
    return (   
    (push ?
    <>
    <ProSidebar collapsed={Collapsed} breakPoint="md">
    <img alt="" src={logo2}/>
      <Menu iconShape="square">
        <SidebarHeader style={{marginLeft: '1rem'}}>
          <Typography variant="h6">{usuarioLogueado.User.Nombre} {usuarioLogueado.User.Apellido}</Typography>
        </SidebarHeader>
        <MenuItem icon={<i className="bx bx-home"></i>}>Inicio<Link to="/home"></Link></MenuItem>
        {
          usuarioLogueado.Roles.map((rol)=>(
            rol.RoleName === "Tecnico" ?
              <MenuItem icon={<i className='bx bx-task'></i>}>Mis tareas a realizar<Link to="/tareas"></Link></MenuItem>
          : rol.RoleName === "Mesa" ?
          <>
            <SubMenu onClick={onClickMenuAbonados} open={SubMenuAbonados} title="Abonados" icon={<i className="bx bx-user"></i>}>
              <MenuItem  icon={<i className='bx bxs-user-detail' ></i>}>Inscriptos<Link to="/abonados-inscriptos"></Link></MenuItem>
              <MenuItem icon={<i className='bx bx-user-check' ></i>}>Activos<Link to="/abonados-activos"></Link></MenuItem>
              <MenuItem icon={<i className='bx bx-user-x' ></i>}>Inactivos<Link to="/abonados-inactivos"></Link></MenuItem>
            </SubMenu>
            <MenuItem icon={<i className="bx bx-calculator"></i>}>Cierre de caja<Link to="/cierre-de-caja"></Link></MenuItem>
          </>
          : rol.RoleName === "Jefe" || rol.RoleName === "Admin" ?
          <>
          <SubMenu onClick={onClickMenuTecnicos} open={SubMenuTecnicos} title="Técnicos y OT" icon={<i className="bx bx-wrench"></i>}>
            <MenuItem icon={<i className='bx bx-clipboard'></i>}>Listado de OT<Link to="/ordenes-de-trabajo"></Link></MenuItem>
            <MenuItem icon={<i className='bx bx-task'></i>}>Mis OT<Link to="/mis-ot"></Link></MenuItem>
          </SubMenu>
          <SubMenu onClick={onClickMenuAbonados} open={SubMenuAbonados} title="Abonados" icon={<i className="bx bx-user"></i>}>
            <MenuItem icon={<i className='bx bxs-user-detail' ></i>}>Inscriptos<Link to="/abonados-inscriptos"></Link></MenuItem>
            <MenuItem icon={<i className='bx bx-user-check' ></i>}>Activos<Link to="/abonados-activos"></Link></MenuItem>
            <MenuItem icon={<i className='bx bx-user-x' ></i>}>Inactivos<Link to="/abonados-inactivos"></Link></MenuItem>
          </SubMenu>
          <MenuItem icon={<i className="bx bx-calculator"></i>}>Cierre de caja<Link to="/cierre-de-caja"></Link></MenuItem>
          <SubMenu onClick={onClickMenuUsuarios} open={SubMenuUsuarios} title="Usuarios" icon={<i className="bx bx-group"></i>}>
            <MenuItem icon={<i className='bx bxs-user'></i>}>Usuarios<Link to="/users"></Link></MenuItem>
            <MenuItem icon={<i className='bx bxs-user-account'></i>}>Roles<Link to="/roles"></Link></MenuItem>
          </SubMenu>
          <SubMenu onClick={onClickMenuAdministracion} open={SubMenuAdministracion} title="Administración" icon={<i className="bx bxs-brightness"></i>}>
            <MenuItem icon={<i className="bx bx-plug"></i>}>Servicios<Link to="/servicios"></Link></MenuItem>
            <MenuItem icon={<i className="bx bx-map"></i>}>Barrios y Municipios<Link to="/barrios-municipios"></Link></MenuItem>
            <MenuItem icon={<i className="bx bx-broadcast"></i>}>Onus y Modelos ONUS<Link to="/onus-modelosOnus"></Link></MenuItem>
            <MenuItem icon={<i className='bx bx-clipboard'></i>}>Tareas<Link to="/tareas"></Link></MenuItem>
          </SubMenu>
          </>
        : "" ))}
        <SidebarFooter>
        <MenuItem onClick={() => cerrarSesion()} icon={<i className='bx bx-log-out-circle'></i>}>Salir</MenuItem>
      </SidebarFooter>
      </Menu>
    </ProSidebar>
    <div className="header">
        <i onClick={onClickCollapsed} className="bx bx-menu"/>
    </div>
  </>
  : "") 
  );
}
 
export default Aside;