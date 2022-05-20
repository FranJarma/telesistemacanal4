
import React, { useContext } from 'react';
import { Page, Document, StyleSheet, Image, Text, View, Font } from '@react-pdf/renderer';
import { Tooltip } from '@material-ui/core';
import logo from './../../../images/logo-ts-transparente.png';
import logo2 from './../../../images/olinet.png';

import OpenSans from '../../../../fonts/OpenSans.ttf'
import OpenSansBold from '../../../../fonts/OpenSansBold.ttf'
import AppContext from '../../../../context/appContext';
import convertirAFecha from './../../../../helpers/ConvertirAFecha';

Font.register({
  family: 'OpenSans',
  src: OpenSans
});

Font.register({
  family: 'OpenSansBold',
  src: OpenSansBold
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'OpenSans',
    fontSize: 12,
    paddingTop: 60,
    paddingLeft: 30,
    paddingRight: 30,
    flexDirection: 'column'
  }, 
  logo: {
      width: 100,
      height: 100,
      padding: 0,
      bottom: 35,
  },
  title: {
    textTransform: 'uppercase',
    fontSize: 18,
    fontFamily: 'OpenSansBold',
    textAlign: 'center',
    paddingTop: 40
  },
  subtitle: {
    fontFamily: 'OpenSansBold',
    fontSize: 12,
    padding: 10,
    display: 'inline',
  },
  description: {
    fontSize: 8,
    bottom: 50,
    paddingLeft: 10,
  },
  subtitleSpan: {
    fontFamily: 'OpenSans',
    fontSize: 12
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '50%'
  },
  row: {
    display: 'flex',
    flexDirection: 'row'
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  footer: {
    marginTop: 'auto',
    marginBottom: '10'
  },
  divisor: {
    borderTop: '2px dotted #e2e2e2',
    paddingTop: 50
  },
  tipoComprobante: {
    fontFamily: 'OpenSansBold',
    fontSize: 22,
    marginLeft: 'auto'
  },
  firma: {
    borderTop: '1px dotted #000',
    width: 150,
    left: 100,
    marginTop: 30,
    marginBottom: 50
  },
  firmaSpan: {
    textAlign: 'center'
  }
});

const ReciboCaratula = ({data}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View>
        <View style={styles.row} fixed>
          <View style={styles.column}>
            <View style={styles.row}>
              <Image style={styles.logo} src={logo}/>
              <Image style={styles.logo} src={logo2}/>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.description}>Domicilio: Av. Jujuy 428 B° Juan M. de Rosas</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.description}>Teléfono: 4913742</Text>
              </View>           
            </View>
          </View>
          <View style={styles.column}>
            <Text style={styles.subtitle}>Recibo N°: <Text style={styles.subtitleSpan}>{data.DetallePagoId}</Text></Text>
            <Text style={styles.subtitle}>Fecha de emisión: <Text style={styles.subtitleSpan}>{convertirAFecha(data.createdAt)}</Text></Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.subtitle}>Recibimos del Sr: <Text style={styles.subtitleSpan}>{data.ApellidoAbonado}, {data.NombreAbonado}</Text></Text>
            <Text style={styles.subtitle}>CUIL: <Text style={styles.subtitleSpan}>{data.Cuit}</Text></Text>
            <Text style={styles.subtitle}>Municipio: <Text style={styles.subtitleSpan}>{data.MunicipioNombre}</Text></Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.subtitle}>N°: <Text style={styles.subtitleSpan}>adsads</Text></Text>
            <Text style={styles.subtitle}>Domicilio: <Text style={styles.subtitleSpan}>{data.DomicilioCalle}, {data.DomicilioNumero}</Text></Text>
            <Text style={styles.subtitle}>Barrio: <Text style={styles.subtitleSpan}>{data.BarrioNombre}</Text></Text>
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.subtitle}>En concepto de: <Text style={styles.subtitleSpan}>{data.MovimientoConceptoNombre}</Text></Text>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.subtitle}>Son: <Text style={styles.subtitleSpan}>$ {data.MovimientoCantidad}</Text></Text>
          </View>
          <View style={styles.column}>
            <View style={styles.firma}>
              <Text style={styles.firmaSpan}>Firma</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.divisor}>
      <View style={styles.row} fixed>
          <View style={styles.column}>
            <View style={styles.row}>
              <Image style={styles.logo} src={logo}/>
              <Image style={styles.logo} src={logo2}/>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.description}>Domicilio: Av. Jujuy 428 B° Juan M. de Rosas</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.description}>Teléfono: 4913742</Text>
              </View>           
            </View>
          </View>
          <View style={styles.column}>
            <Text style={styles.subtitle}>Recibo N°: <Text style={styles.subtitleSpan}>{data.DetallePagoId}</Text></Text>
            <Text style={styles.subtitle}>Fecha de emisión: <Text style={styles.subtitleSpan}>{convertirAFecha(data.createdAt)}</Text></Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.subtitle}>Recibimos del Sr: <Text style={styles.subtitleSpan}>{data.ApellidoAbonado}, {data.NombreAbonado}</Text></Text>
            <Text style={styles.subtitle}>CUIL: <Text style={styles.subtitleSpan}>{data.Cuit}</Text></Text>
            <Text style={styles.subtitle}>Municipio: <Text style={styles.subtitleSpan}>{data.MunicipioNombre}</Text></Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.subtitle}>N°: <Text style={styles.subtitleSpan}>adsads</Text></Text>
            <Text style={styles.subtitle}>Domicilio: <Text style={styles.subtitleSpan}>{data.DomicilioCalle}, {data.DomicilioNumero}</Text></Text>
            <Text style={styles.subtitle}>Barrio: <Text style={styles.subtitleSpan}>{data.BarrioNombre}</Text></Text>
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.subtitle}>En concepto de: <Text style={styles.subtitleSpan}>{data.MovimientoConceptoNombre}</Text></Text>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.subtitle}>Son: <Text style={styles.subtitleSpan}>$ {data.MovimientoCantidad}</Text></Text>
          </View>
          <View style={styles.column}>
            <View style={styles.firma}>
              <Text style={styles.firmaSpan}>Firma</Text>
            </View>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

const Recibo = ({data}) => {
  const appContext = useContext(AppContext);
  const { descargarComprobante } = appContext;

  return (
    <>
    <Tooltip title="Descargar recibo">
      <i style={{color: "teal"}} className='bx bx-file bx-xs' onClick={() => descargarComprobante("Recibo", <ReciboCaratula data={data}/>, data)}></i>
    </Tooltip>
    </>
  );
}

export default Recibo;