import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import esLocale from 'date-fns/locale/es';
import Home from './views/components/Home';
import ListaPagos from './views/components/pagos/ListaPagos';
import ListaAbonadosActivos from './views/components/abonados/ListaAbonadosActivos';
import ListaAbonadosInactivos from './views/components/abonados/ListaAbonadosInactivos';
import ListaDetallesPagos from './views/components/detallesPagos/ListaDetallesPagos';
import CaratulaDetallePago from './views/components/detallesPagos/CaratulaDetallePago';
import Login from './views/components/auth/Login';
import AbonadoState from './context/abonados/abonadoState';
import ProvinciaState from './context/provincias/provinciaState';
import MunicipioState from './context/municipios/municipioState';
import BarrioState from './context/barrios/barrioState';
import ServicioState from './context/servicios/servicioState';
import CondicionesIVAState from './context/condicionesIVA/condicionesIVAState';
import Cargando from './views/components/design/components/Cargando';

const CaratulaAbonado = lazy(() => {
  return new Promise(resolve => setTimeout(resolve, 2 * 1000)).then(
    () =>
      Math.floor(Math.random() * 10) >= 1
        ? import('./views/components/abonados/CaratulaAbonado')
        : Promise.reject(new Error())
  );
});

const DomiciliosAbonado = lazy(() => {
  return new Promise(resolve => setTimeout(resolve, 2 * 1000)).then(
    () =>
      Math.floor(Math.random() * 10) >= 1
        ? import('./views/components/abonados/DomiciliosAbonado')
        : Promise.reject(new Error())
  );
});
const CambioTitularidad = lazy(() => {
  return new Promise(resolve => setTimeout(resolve, 2 * 1000)).then(
    () =>
      Math.floor(Math.random() * 10) >= 1
        ? import('./views/components/abonados/CambioTitularidad')
        : Promise.reject(new Error())
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
          <AbonadoState>
            <ProvinciaState>
              <MunicipioState>
                <BarrioState>
                  <ServicioState>
                    <CondicionesIVAState>
                        <Switch>
                          <Route exact path="/">
                            <Login/>
                          </Route>
                          <Route exact path="/home">
                            <Home/>
                          </Route>
                          <Route exact path="/abonados-activos">
                              <ListaAbonadosActivos/>
                          </Route>
                          <Route exact path="/abonados-inactivos">
                            <ListaAbonadosInactivos/>
                          </Route>
                          <Route path="/caratula-abonado">
                            <Suspense fallback={<Cargando/>}>
                              <CaratulaAbonado/>
                            </Suspense>
                          </Route>
                          <Route path="/domicilios-abonado">
                            <Suspense fallback={<Cargando/>}>
                              <DomiciliosAbonado/>
                            </Suspense>
                          </Route>
                          <Route path="/cambio-titularidad">
                            <Suspense fallback={<Cargando/>}>
                              <CambioTitularidad/>
                            </Suspense>
                          </Route>
                          <Route path="/historial-de-pagos">
                            <ListaPagos/>
                          </Route>
                          <Route path="/detalles-pago">
                            <ListaDetallesPagos/>
                          </Route>
                          <Route path="/caratula-detalle-pago">
                            <CaratulaDetallePago/>
                          </Route>
                        </Switch>
                        </CondicionesIVAState>
                  </ServicioState>
                </BarrioState>
              </MunicipioState>
            </ProvinciaState>
          </AbonadoState>
        </Router>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
    </>
  );
}

export default App;
