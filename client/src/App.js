import React, { lazy, Suspense } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import esLocale from 'date-fns/locale/es';
import AppState from './context/appState';
import Login from'./views/components/auth/Login';
import Home from'./views/components/Home';
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
import ListaMisOt from './views/components/tecnicos/ListaMisOt';
import ListaTareas from './views/components/tecnicos/ListaTareas';
import ListaOtPendientes from './views/components/tecnicos/ListaOtPendientes';
import ListaOtFinalizadas from './views/components/tecnicos/ListaOtFinalizadas';
import ListaMovimientos from './views/components/caja/ListaMovimientos';
import ListaMediosPago from './views/components/mediosPago/ListaMediosPago';
import ListaAbonadosAtrasados from './views/components/abonados/ListaAbonadosAtrasados';
import { AuthRoute } from './routes/AuthRoute';

//revisamos si tenemos un token
const token = localStorage.getItem('token');
if (token) {
  tokenAuthHeaders(token);
}

// const Home = lazy(() => {
//   return new Promise(resolve => setTimeout(resolve, 4000)).then(
//     () => import('./views/components/Home')
//   );  
// });

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
        <BrowserRouter>
          <AppState>
            <Routes>

              <Route exact
              path="/"
              element={
                <Suspense fallback={<Cargando/>}>
                  <Login/>
                </Suspense>
              }>
              </Route>

              <Route exact
              path="/home"
              element={
                <Suspense fallback={<Cargando/>}>
                  <Home/>
                </Suspense>
              }>
              </Route>

              <Route exact
              path="/barrios-municipios"
              element={
                <AuthRoute roles={["Jefe", "Admin"]}>
                  <BarriosMunicipios/>
                </AuthRoute>
              }>
              </Route>

              <Route exact
              path="/servicios"
              element={
                <AuthRoute roles={["Jefe", "Admin"]}>
                  <ListaServicios/>
                </AuthRoute>
              }>
              </Route>

              <Route exact
              path="/medios-de-pago"
              element={
                <AuthRoute roles={["Jefe", "Admin"]}>
                  <ListaMediosPago/>
                </AuthRoute>
              }>
              </Route>

              <Route exact
              path="/onus"
              element={
                <AuthRoute roles={["Jefe", "Admin"]}>
                  <OnusModelosOnus/>
                </AuthRoute>
              }>
              </Route>

              <Route exact
              path="/tareas"
              element={
                <AuthRoute roles={["Jefe", "Admin"]}>
                  <ListaTareas/>
                </AuthRoute>
              }>
              </Route>

              <Route exact
              path="/users"
              element={
                <AuthRoute roles={["Jefe", "Admin"]}>
                  <ListaUsers/>
                </AuthRoute>
              }>
              </Route>

              <Route exact
              path="/roles"
              element={
                <AuthRoute roles={["Jefe", "Admin"]}>
                  <ListaRoles/>
                </AuthRoute>
              }>
              </Route>

              <Route exact
              path="/cierre-de-caja"
              element={
                <AuthRoute roles={["Jefe", "Admin"]}>
                  <ListaMovimientos/>
                </AuthRoute>
              }>
              </Route>

              <Route
              path="/caratula-user/:UserId"
              element={
                <AuthRoute roles={["Jefe", "Admin"]}>
                  <Suspense fallback={<Cargando/>}>
                    <CaratulaUser/>
                  </Suspense>
                </AuthRoute>
              }>
              </Route>

              <Route
              path="/caratula-role"
              element={
                <AuthRoute roles={["Jefe", "Admin"]}>
                  <Suspense fallback={<Cargando/>}>
                    <CaratulaRole/>
                  </Suspense>
                </AuthRoute>
              }>
              </Route>

              <Route exact
              path="/abonados-activos"
              element={
                <AuthRoute roles={["Jefe", "Admin", "Mesa"]}>
                  <ListaAbonadosActivos/>
                </AuthRoute>
              }>
              </Route>

              <Route exact
              path="/abonados-inscriptos"
              element={
                <AuthRoute roles={["Jefe", "Admin", "Mesa"]}>
                  <ListaAbonadosInscriptos/>
                </AuthRoute>
              }>
              </Route>

              <Route exact
              path="/abonados-inactivos"
              element={
                <AuthRoute roles={["Jefe", "Admin", "Mesa"]}>
                  <ListaAbonadosInactivos/>
                </AuthRoute>
              }>
              </Route>

              <Route exact
              path="/abonados-atrasados"
              element={
                <AuthRoute roles={["Jefe", "Admin", "Mesa"]}>
                  <ListaAbonadosAtrasados/>
                </AuthRoute>
              }>
              </Route>

              <Route
              path="/caratula-abonado"
              element={
                <AuthRoute roles={["Jefe", "Admin", "Mesa"]}>
                  <Suspense fallback={<Cargando/>}>
                    <CaratulaAbonado/>
                  </Suspense>
                </AuthRoute>
              }>
              </Route>

              <Route
              path="/caratula-abonado/:AbonadoNumero"
              element={
                <AuthRoute roles={["Jefe", "Admin", "Mesa"]}>
                  <Suspense fallback={<Cargando/>}>
                    <CaratulaAbonado/>
                  </Suspense>
                </AuthRoute>
              }>
              </Route>

              <Route
              path="/cambio-domicilio/:AbonadoNumero"
              element={
                <AuthRoute roles={["Jefe", "Admin", "Mesa"]}>
                  <CambioDomicilio/>
                </AuthRoute>
              }>
              </Route>

              <Route
              path="/cambio-servicio/:AbonadoNumero"
              element={
                <AuthRoute roles={["Jefe", "Admin", "Mesa"]}>
                  <CambioServicio/>
                </AuthRoute>
              }>
              </Route>

              <Route
              path="/cambio-titularidad/:AbonadoNumero"
              element={
                <AuthRoute roles={["Jefe", "Admin", "Mesa"]}>
                  <Suspense fallback={<Cargando/>}>
                    <CambioTitularidad/>
                  </Suspense>
                </AuthRoute>
              }>
              </Route>

              <Route
              path="/historial-de-pagos/:AbonadoNumero"
              element={
                <AuthRoute roles={["Jefe", "Admin", "Mesa"]}>
                  <ListaPagos/>
                </AuthRoute>
              }>
              </Route>

              <Route
              path="/caratula-ot"
              element={
                <AuthRoute roles={["Jefe", "Admin", "Mesa"]}>
                  <Suspense fallback={<Cargando/>}>
                    <CaratulaOT/>
                  </Suspense>
                </AuthRoute>
              }>
              </Route>

              <Route
              path="/caratula-ot/:OtId"
              element={
                <AuthRoute roles={["Jefe", "Admin", "Mesa"]}>
                  <Suspense fallback={<Cargando/>}>
                    <CaratulaOT/>
                  </Suspense>
                </AuthRoute>
              }>
              </Route>

              <Route exact
              path="/ot-pendientes"
              element={
                <AuthRoute roles={["Jefe", "Admin", "Mesa"]}>
                  <ListaOtPendientes/>
                </AuthRoute>
              }>
              </Route>

              <Route exact
              path="/ot-finalizadas"
              element={
                <AuthRoute roles={["Jefe", "Admin", "Mesa"]}>
                  <ListaOtFinalizadas/>
                </AuthRoute>
              }>
              </Route>

              <Route
              path="/perfil-user"
              element={
                <AuthRoute roles={["Jefe", "Admin", "Mesa", "Tecnico"]}>
                  <Suspense fallback={<Cargando/>}>
                    <PerfilUser/>
                  </Suspense>
                </AuthRoute>
              }>
              </Route>

              <Route exact
              path="/mis-ot"
              element={
                <AuthRoute roles={["Jefe", "Admin", "Tecnico"]}>
                  <ListaMisOt/>
                </AuthRoute>
              }>
              </Route>
              
            </Routes>
          </AppState>
        </BrowserRouter>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
    </>
  );
}

export default App;
