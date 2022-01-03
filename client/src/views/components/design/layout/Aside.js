import React, { useState, useContext, useEffect } from 'react';
import { ProSidebar, Menu, MenuItem, SubMenu, SidebarHeader, SidebarFooter } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { Link } from 'react-router-dom';
import logo2 from './../../../images/logo2.png';
import AppContext from '../../../../context/appContext';
import { Backdrop, Button, List, ListItem, ListItemIcon, Popover, Typography } from '@material-ui/core';

const Aside = () => {
    const appContext = useContext(AppContext);
    const { obtenerUsuarioAutenticado, usuarioLogueado, push, cerrarSesion } = appContext;
    
    const [width, setWidth] = useState('0px');
    const [backdrop, setBackDrop] = useState(false);
    const [SubMenuAbonados, setSubMenuAbonados] = useState(false);
    const [SubMenuTecnicos, setSubMenuTecnicos] = useState(false);
    const [SubMenuUsuarios, setSubMenuUsuarios] = useState(false);
    const [SubMenuAdministracion, setSubMenuAdministracion] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const onClickWidth = () => {
      setBackDrop(!backdrop);
      if(width === '0px')
        setWidth('280px');
      else {
        setWidth('0px');
      }
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
    <ProSidebar width={width}>
    <img alt="" src={logo2}/>
      <Menu iconShape="square">
        <SidebarHeader style={{marginLeft: '1rem'}}>
          <Typography variant="h6">{localStorage.getItem('usr')}</Typography>
        </SidebarHeader>
        <MenuItem icon={<i className="bx bx-home"></i>}>Inicio<Link to="/home"></Link></MenuItem>
        {
          usuarioLogueado.Roles.map((rol)=>(
            rol.RoleName === "Tecnico" ?
              <MenuItem icon={<i className='bx bx-task'></i>}>Mis órdenes de trabajo<Link to="/mis-ot"></Link></MenuItem>
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
          <SubMenu onClick={onClickMenuTecnicos} open={SubMenuTecnicos} title="Órdenes de Trabajo" icon={<i className="bx bx-wrench"></i>}>
            <MenuItem icon={<i className='bx bx-clipboard'></i>}>OT Pendientes<Link to="/ot-pendientes"></Link></MenuItem>
            <MenuItem icon={<i className='bx bx-calendar-check'></i>}>OT Finalizadas<Link to="/ot-finalizadas"></Link></MenuItem>
            <MenuItem icon={<i className='bx bx-user-pin'></i>}>Mis OT<Link to="/mis-ot"></Link></MenuItem>
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
      </SidebarFooter>
      </Menu>
    </ProSidebar>
    <div className="header">
        <i onClick={onClickWidth} className="bx bx-menu"/>
        <Button startIcon={<i className="bx bxs-user-circle bx-md"></i>} style={{float: 'right', color: '#FFFFFF'}} onClick={handleClick}>{localStorage.getItem('usr')}</Button>
        <Popover 
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <List style={{cursor: 'pointer'}}>
            <Link style={{textDecoration: 'none', color: '#000'}} to={{
              pathname: `/perfil-user/UserId=${usuarioLogueado.User.UserId}`,
              state: usuarioLogueado
            }
            }><ListItem ><ListItemIcon><i className="bx bx-user"></i></ListItemIcon>Perfil del Usuario</ListItem></Link>
            <hr style={{margin: '0 15px 0 15px'}}/>
            <ListItem  onClick={() => cerrarSesion()}><ListItemIcon><i className="bx bx-log-out-circle"></i></ListItemIcon>Salir</ListItem>
          </List>
        </Popover>
    </div>
  </>
  : "") 
  );
}
 
export default Aside;