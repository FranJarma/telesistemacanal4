import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import esLocale from 'date-fns/locale/es';
import Home from './views/components/Home';
import ListaAbonadosActivos from './views/components/abonados/ListaAbonadosActivos';
import CaratulaAbonado from './views/components/abonados/CaratulaAbonado';
import ListaPagos from './views/components/pagos/ListaPagos';
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
                            <CaratulaAbonado/>
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
