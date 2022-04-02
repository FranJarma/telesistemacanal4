  
import React, { useState, useContext, useEffect, useRef } from 'react';
import { ProSidebar, Menu, MenuItem, SubMenu, SidebarHeader, SidebarFooter } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { Link } from 'react-router-dom';
import logo from './../../../images/logo-ts.png';
import AppContext from '../../../../context/appContext';
import { Button, Dialog, List, ListItem, ListItemIcon, Popover, Typography } from '@material-ui/core';

const Aside = () => {
    const appContext = useContext(AppContext);
    const { obtenerUsuarioAutenticado, usuarioLogueado, push, cerrarSesion } = appContext;
    
    const [width, setWidth] = useState('0px');
    const [SubMenuAbonados, setSubMenuAbonados] = useState(false);
    const [SubMenuTecnicos, setSubMenuTecnicos] = useState(false);
    const [SubMenuUsuarios, setSubMenuUsuarios] = useState(false);
    const [subMenuConfiguracion, setsubMenuConfiguracion] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const [backdropOpen, setBackdropOpen] = useState(false);

    const onClickWidth = () => {
      if(width === '0px'){
        setWidth('280px');
        setBackdropOpen(true);
    }
      else {
        setWidth('0px');
        setBackdropOpen(false);
      }
    }
    const onClickMenuAbonados = () => {
      setSubMenuAbonados(!SubMenuAbonados);
      setSubMenuTecnicos(false);
      setSubMenuUsuarios(false);
      setsubMenuConfiguracion(false);
    }
    const onClickMenuTecnicos = () => {
      setSubMenuTecnicos(!SubMenuTecnicos);
      setSubMenuAbonados(false);
      setSubMenuUsuarios(false);
      setsubMenuConfiguracion(false);
    }
    const onClickMenuUsuarios = () => {
      setSubMenuUsuarios(!SubMenuUsuarios);
      setSubMenuAbonados(false);
      setSubMenuTecnicos(false);
      setsubMenuConfiguracion(false);
    }
    const onClickMenuConfiguracion = () => {
      setsubMenuConfiguracion(!subMenuConfiguracion);
      setSubMenuAbonados(false);
      setSubMenuTecnicos(false);
      setSubMenuUsuarios(false);
    }

    /**
     * Hook that alerts clicks outside of the passed ref
     */
    function useOutsideAlerter(ref) {
        useEffect(() => {
            function handleClickOutside(event) {
                if (ref.current && !ref.current.contains(event.target)) {
                    setWidth('0px');
                }
            }
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref]);
    }
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef);

    useEffect(()=> {
      obtenerUsuarioAutenticado();
    },[]);

    return (   
    (push ?
    <>
    <Dialog
    style={{backdropFilter: 'blur(2px)'}}
    open={backdropOpen}
    onClick={() => setBackdropOpen(!backdropOpen)}
    >
    </Dialog>
    <ProSidebar ref={wrapperRef} width={width}>
    <span title="Cerrar"><i style={{marginTop: '10px', marginLeft: '18px', color: "#fff", cursor: 'pointer'}} onClick={onClickWidth} class='bx bx-left-arrow-circle bx-md'></i></span>
    <img alt="logo-tls" src={logo}/>
    <div className="menu" ref={wrapperRef}>
        <Menu iconShape="round">
          <SidebarHeader style={{marginLeft: '1rem'}}>
            <Typography variant="h6">{sessionStorage.getItem('usr')}</Typography>
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
              <SubMenu onClick={onClickMenuTecnicos} open={SubMenuTecnicos} title="Órdenes de Trabajo" icon={<i className="bx bx-wrench"></i>}>
                <MenuItem icon={<i className='bx bx-clipboard'></i>}>OT Pendientes<Link to="/ot-pendientes"></Link></MenuItem>
                <MenuItem icon={<i className='bx bx-calendar-check'></i>}>OT Finalizadas<Link to="/ot-finalizadas"></Link></MenuItem>
              </SubMenu>
            </>
            : rol.RoleName === "Jefe" || rol.RoleName === "Admin" ?
            <>
            <SubMenu onClick={onClickMenuAbonados} open={SubMenuAbonados} title="Abonados" icon={<i className="bx bx-user"></i>}>
              <MenuItem icon={<i className='bx bxs-user-detail' ></i>}>Inscriptos<Link to="/abonados-inscriptos"></Link></MenuItem>
              <MenuItem icon={<i className='bx bx-user-check' ></i>}>Activos<Link to="/abonados-activos"></Link></MenuItem>
              <MenuItem icon={<i className='bx bx-user-x' ></i>}>Inactivos<Link to="/abonados-inactivos"></Link></MenuItem>
              <MenuItem icon={<i className='bx bx-timer' ></i>}>Atrasados<Link to="/abonados-inactivos"></Link></MenuItem>
            </SubMenu>
            <SubMenu onClick={onClickMenuTecnicos} open={SubMenuTecnicos} title="Órdenes de Trabajo" icon={<i className="bx bx-wrench"></i>}>
              <MenuItem icon={<i className='bx bx-clipboard'></i>}>OT Pendientes<Link to="/ot-pendientes"></Link></MenuItem>
              <MenuItem icon={<i className='bx bx-calendar-check'></i>}>OT Finalizadas<Link to="/ot-finalizadas"></Link></MenuItem>
              <MenuItem icon={<i className='bx bx-user-pin'></i>}>Mis OT<Link to="/mis-ot"></Link></MenuItem>
            </SubMenu>
            <MenuItem icon={<i className="bx bx-calculator"></i>}>Cierre de caja<Link to="/cierre-de-caja"></Link></MenuItem>
            <SubMenu onClick={onClickMenuUsuarios} open={SubMenuUsuarios} title="Usuarios" icon={<i className="bx bx-group"></i>}>
              <MenuItem icon={<i className='bx bxs-user'></i>}>Usuarios<Link to="/users"></Link></MenuItem>
              <MenuItem icon={<i className='bx bxs-user-account'></i>}>Roles<Link to="/roles"></Link></MenuItem>
            </SubMenu>
            <SubMenu onClick={onClickMenuConfiguracion} open={subMenuConfiguracion} title="Configuración" icon={<i className="bx bxs-brightness"></i>}>
              <MenuItem icon={<i className="bx bx-money"></i>}>Medios de Pago<Link to="/medios-de-pago"></Link></MenuItem>
              <MenuItem icon={<i className="bx bx-plug"></i>}>Servicios<Link to="/servicios"></Link></MenuItem>
              <MenuItem icon={<i className="bx bx-map"></i>}>Barrios y Municipios<Link to="/barrios-municipios"></Link></MenuItem>
              <MenuItem icon={<i className="bx bx-broadcast"></i>}>Onus<Link to="/onus"></Link></MenuItem>
              <MenuItem icon={<i className='bx bx-clipboard'></i>}>Tareas<Link to="/tareas"></Link></MenuItem>
            </SubMenu>
            </>
          : "" ))}
          <SidebarFooter>
        </SidebarFooter>
        </Menu>
      </div>
    </ProSidebar>

    <div className="header">
        <i style={{display: width === '280px' ? "none" : "unset"}} onClick={onClickWidth} className="bx bx-menu"/>
        <Button startIcon={<i className="bx bxs-user-circle bx-md"></i>} style={{float: 'right', color: '#FFFFFF'}} onClick={handleClick}>{sessionStorage.getItem('usr')}</Button>
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
          <List style={{ cursor: 'pointer'}}>
            <Link style={{textDecoration: 'none', color: '#000'}} to={{
              pathname: '/perfil-user',
              state: usuarioLogueado
            }
            }>
            <ListItem>
            <ListItemIcon>
            <i className="bx bx-user"></i>
            </ListItemIcon>
            Perfil del Usuario
            </ListItem>
            </Link>
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
