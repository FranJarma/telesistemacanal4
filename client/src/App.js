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
import Login from './views/components/auth/Login';
import {ErrorBoundary} from 'react-error-boundary'
import ErrorFallback from './views/components/errorBoundary/ErrorBoundary';

//revisamos si tenemos un token
const token = localStorage.getItem('token');
if (token) {
  tokenAuthHeaders(token);
}

// const Login = lazy(() => {
//   return new Promise(resolve => setTimeout(resolve, 3000)).then(
//     () => import('./views/components/auth/Login')
//   );
// });

const Home = lazy(() => {
  return new Promise(resolve => setTimeout(resolve, 3000)).then(
    () => import('./views/components/Home')
  );  
});

const CaratulaAbonado = lazy(() => {
  return new Promise(resolve => setTimeout(resolve, 3000)).then(
    () => import('./views/components/abonados/CaratulaAbonado')
  );
});

const CaratulaUser = lazy(() => {
  return new Promise(resolve => setTimeout(resolve, 3000)).then(
    () => import('./views/components/users/CaratulaUser')
  );
});

const CaratulaRole = lazy(() => {
  return new Promise(resolve => setTimeout(resolve, 3000)).then(
    () => import('./views/components/roles/CaratulaRole')
  );
});

const CambioTitularidad = lazy(() => {
  return new Promise(resolve => setTimeout(resolve, 2 * 1000)).then(
    () => import('./views/components/abonados/CambioTitularidad')
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
      marginBottom: '1.5rem',
      fontFamily: 'Poppins',
      marginTop: '3rem',
      color: "teal",
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
      fontSize: 12,
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
      main: "#008080"
    },
    secondary: {
      main: "#f44336"
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
                  <Route exact path="/">
                    <Login/>
                  </Route>
                  <ErrorBoundary
                      FallbackComponent={ErrorFallback}
                  >
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
                  <PrivateRoute path="/servicios" component={ListaServicios}>
                  </PrivateRoute>
                  <PrivateRoute path="/barrios-municipios" component={BarriosMunicipios}>
                  </PrivateRoute>
                  <PrivateRoute path="/onus-modelosOnus" component={OnusModelosOnus}>
                  </PrivateRoute>
                  </ErrorBoundary>
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
