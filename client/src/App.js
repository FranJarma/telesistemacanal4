import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import esLocale from 'date-fns/locale/es';
import AppState from './context/appState';
import ListaPagos from './views/components/pagos/ListaPagos';
import ListaServicios from './views/components/servicios/ListaServicios';
import ListaAbonadosActivos from './views/components/abonados/ListaAbonadosActivos';
import CambioDomicilio from './views/components/abonados/CambioDomicilio';
import CambioServicio from './views/components/abonados/CambioServicio';
import ListaAbonadosInactivos from './views/components/abonados/ListaAbonadosInactivos';
import Cargando from './views/components/design/components/Cargando';
import ListaAbonadosInscriptos from './views/components/abonados/ListaAbonadosInscriptos';
import BarriosMunicipios from './views/components/barrios-municipios/BarriosMunicipios';
import OnusModelosOnus from './views/components/onus/OnusModelosOnus';
import ListaUsers from './views/components/users/ListaUsers';
import ListaRoles from './views/components/roles/ListaRoles';
import tokenAuthHeaders from './config/token';
import PrivateRoute from './routes/PrivateRoute';
import LoginRoute from './routes/LoginRoute';
import ListaMisOt from './views/components/tecnicos/ListaMisOt';
import ListaTareas from './views/components/tecnicos/ListaTareas';
import ListaOtPendientes from './views/components/tecnicos/ListaOtPendientes';
import ListaOtFinalizadas from './views/components/tecnicos/ListaOtFinalizadas';
import ListaMovimientos from './views/components/caja/ListaMovimientos';
import ListaMediosPago from './views/components/mediosPago/ListaMediosPago';

//revisamos si tenemos un token
const token = sessionStorage.getItem('token');
if (token) {
  tokenAuthHeaders(token);
}

const Login = lazy(() => {
  return new Promise(resolve => setTimeout(resolve, 4000)).then(
    () => import('./views/components/auth/Login')
  );
});

const Home = lazy(() => {
  return new Promise(resolve => setTimeout(resolve, 4000)).then(
    () => import('./views/components/Home')
  );  
});

const CaratulaAbonado = lazy(() => {
  return new Promise(resolve => setTimeout(resolve, 4000)).then(
    () => import('./views/components/abonados/CaratulaAbonado')
  );
});

const CaratulaUser = lazy(() => {
  return new Promise(resolve => setTimeout(resolve, 4000)).then(
    () => import('./views/components/users/CaratulaUser')
  );
});

const PerfilUser = lazy(() => {
  return new Promise(resolve => setTimeout(resolve, 4000)).then(
    () => import('./views/components/users/PerfilUser')
  );
});

const CaratulaRole = lazy(() => {
  return new Promise(resolve => setTimeout(resolve, 4000)).then(
    () => import('./views/components/roles/CaratulaRole')
  );
});

const CambioTitularidad = lazy(() => {
  return new Promise(resolve => setTimeout(resolve, 4000)).then(
    () => import('./views/components/abonados/CambioTitularidad')
  );
});

const CaratulaOT = lazy(() => {
  return new Promise(resolve => setTimeout(resolve, 4000)).then(
    () => import('./views/components/tecnicos/CaratulaOT')
  );
});

const theme = createTheme({
  typography: {
    h1: {
      fontSize: 16,
      fontFamily: 'Poppins',
      fontWeight: 'bold'
    },
    h2: {
      fontSize: 14,
      fontFamily: 'Poppins',
      marginTop: '1rem',
      marginBottom: '1rem',
      color: "#4D7F9E",
      textTransform: "uppercase",
    },
    //titulo principal de Home
    h3: {
      color: "#FFFFFF",
      fontSize: 18,
      padding: '1.5rem',
      marginLeft: '5rem',
      fontFamily: 'Poppins',
      fontWeight: 'bold'
    },
    h6: {
      fontSize: 14,
      fontFamily: 'Poppins'
    },
    body1: {
      fontFamily: 'Poppins',
      fontSize: 14
    },
    body2: 'sans-serif'
  },
  palette: {
    primary: {
      main: "#e3ac4d"
    },
    secondary: {
      main: "#4D7F9E"
    }
  }
}, esLocale)
function App() {
  return (
    <>
    <ThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
        <Router>
          <AppState>
            <Switch>
                <Suspense fallback={<Cargando/>}>
                  <LoginRoute exact path="/">
                    <Login/>
                  </LoginRoute>
                  <PrivateRoute exact path="/home" component={Home}>
                  </PrivateRoute>
                  <PrivateRoute exact path="/users" component={ListaUsers}>
                  </PrivateRoute>
                  <PrivateRoute exact path="/roles" component={ListaRoles}>
                  </PrivateRoute>
                  <PrivateRoute exact path="/abonados-inscriptos" component={ListaAbonadosInscriptos}>
                  </PrivateRoute>
                  <PrivateRoute exact path="/abonados-activos" component={ListaAbonadosActivos}>
                  </PrivateRoute>
                  <PrivateRoute exact path="/abonados-inactivos" component={ListaAbonadosInactivos}>
                  </PrivateRoute>
                  <PrivateRoute path="/caratula-abonado" component={CaratulaAbonado}>
                  </PrivateRoute>
                  <PrivateRoute path="/caratula-user" component={CaratulaUser}>
                  </PrivateRoute>
                  <PrivateRoute path="/perfil-user" component={PerfilUser}>
                  </PrivateRoute>
                  <PrivateRoute path="/caratula-role" component={CaratulaRole}>
                  </PrivateRoute>
                  <PrivateRoute path="/cambio-domicilio" component={CambioDomicilio}>
                  </PrivateRoute>
                  <PrivateRoute path="/cambio-servicio" component={CambioServicio}>
                  </PrivateRoute>
                  <PrivateRoute path="/cambio-titularidad" component={CambioTitularidad}>
                  </PrivateRoute>
                  <PrivateRoute path="/historial-de-pagos" component={ListaPagos}>
                  </PrivateRoute>
                  <PrivateRoute exact path="/servicios" component={ListaServicios}>
                  </PrivateRoute>
                  <PrivateRoute exact path="/barrios-municipios" component={BarriosMunicipios}>
                  </PrivateRoute>
                  <PrivateRoute exact path="/onus" component={OnusModelosOnus}>
                  </PrivateRoute>
                  <PrivateRoute exact path="/medios-de-pago" component={ListaMediosPago}>
                  </PrivateRoute>
                  <PrivateRoute path="/caratula-ot" component={CaratulaOT}>
                  </PrivateRoute>
                  <PrivateRoute exact path="/ot-pendientes" component={ListaOtPendientes}>
                  </PrivateRoute>
                  <PrivateRoute exact path="/ot-finalizadas" component={ListaOtFinalizadas}>
                  </PrivateRoute>
                  <PrivateRoute exact path="/mis-ot" component={ListaMisOt}>
                  </PrivateRoute>
                  <PrivateRoute exact path="/tareas" component={ListaTareas}>
                  </PrivateRoute>
                  <PrivateRoute exact path="/cierre-de-caja" component={ListaMovimientos}>
                  </PrivateRoute>
                </Suspense>
            </Switch>
          </AppState>
        </Router>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
    </>
  );
}

export default App;
