
import React from 'react';
import { Page, Document, StyleSheet, Image, Text, View, Font } from '@react-pdf/renderer';
import logo from './../../../../assets/images/logo-ts-transparente.png';
import logo2 from './../../../../assets/images/olinet.png';
import FacturaItemsTable from './FacturaItemsTable';

import OpenSans from '../../../../assets/fonts/OpenSans.ttf'
import OpenSansBold from '../../../../assets/fonts/OpenSansBold.ttf'

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
    paddingTop: 30,
    paddingLeft: 30,
    paddingRight: 30,
    flexDirection: 'column',
    border: '1px solid #e2e2e2'
  }, 
  logo: {
      width: 100,
      height: 100,
      padding: 0,
  },
  qr: {
    width: 80,
    height: 80,
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
    fontSize: 10,
    padding: 5,
    display: 'inline'
  },
  subtitleSpan: {
    fontFamily: 'OpenSans',
    fontSize: 10
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
    justifyContent: 'space-evenly',
    backgroundColor: '#e2e2e2'
  },
  footer: {
    marginTop: 'auto',
    marginBottom: '10'
  },
  divisor: {
    borderTop: '1px solid #e2e2e2',
    padding: 10
  },
  tipoComprobante: {
    fontFamily: 'OpenSansBold',
    fontSize: 22,
    marginLeft: 'auto'
  }
});

const qrBase64 = () => {
  const qrCodeCanvas = document.querySelector('canvas');
  const qrCodeDataUri = qrCodeCanvas.toDataURL('image/jpg', 0.3);
  return qrCodeDataUri;
}
const FacturaCaratula = ({data}) => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
            <Image style={styles.logo} src={logo}/>
            <Text style={styles.title}>Factura B (Cod N° 006)</Text>
            <Image style={styles.logo} src={logo2}/>
        </View>
        <View style={styles.divisor}></View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.subtitle}>Razón social: <Text style={styles.subtitleSpan}>TELE SISTEMA SRL</Text></Text>
            <Text style={styles.subtitle}>Domicilio Comercial: <Text style={styles.subtitleSpan}> Av Jujuy 428 - Perico, Jujuy</Text></Text>
            <Text style={styles.subtitle}>Condición frente al IVA: <Text style={styles.subtitleSpan}>IVA Responsable Inscripto</Text></Text>
            <Text style={styles.subtitle}>CUIT: <Text style={styles.subtitleSpan}>{data.FacturaCuitEmisor}</Text></Text>
            <Text style={styles.subtitle}>Ingresos brutos: <Text style={styles.subtitleSpan}>B-2-2784</Text></Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.subtitle}>Punto de venta: <Text style={styles.subtitleSpan}>00002</Text></Text>
            <Text style={styles.subtitle}>Comp N°: <Text style={styles.subtitleSpan}>{data.FacturaNumeroComprobante}</Text></Text>
            <Text style={styles.subtitle}>Fecha de Emisión: <Text style={styles.subtitleSpan}>{data.FacturaFechaEmision.split('-').reverse().join('/')}</Text></Text>
            <Text style={styles.subtitle}>Fecha de Inicio de Actividades: <Text style={styles.subtitleSpan}>01/03/1996</Text></Text>
          </View>
        </View>
        <View style={styles.divisor}></View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.subtitle}>Desde: <Text style={styles.subtitleSpan}>{data.FacturaFechaEmision.split('-').reverse().join('/')}</Text></Text>
            <Text style={styles.subtitle}>Hasta: <Text style={styles.subtitleSpan}>{data.FacturaFechaEmision.split('-').reverse().join('/')}</Text></Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.subtitle}>Vencimiento del pago: <Text style={styles.subtitleSpan}>{data.FacturaFechaEmision.split('-').reverse().join('/')}</Text></Text>
          </View>
        </View>
        <View style={styles.divisor}></View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.subtitle}>Doc: <Text style={styles.subtitleSpan}>{data.FacturaNroDocReceptor}</Text></Text>
            <Text style={styles.subtitle}>Condición frente al IVA: <Text style={styles.subtitleSpan}>Consumidor Final</Text></Text>
            <Text style={styles.subtitle}>Condición de venta: <Text style={styles.subtitleSpan}>Contado</Text></Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.subtitle}>Apellido y Nombre / Razón Social: <Text style={styles.subtitleSpan}>{data.ApellidoAbonado}, {data.NombreAbonado}</Text></Text>
            <Text style={styles.subtitle}>Domicilio: <Text style={styles.subtitleSpan}>{data.DomicilioCalle} {data.DomicilioNumero} B°{data.BarrioNombre}</Text></Text>
          </View>
        </View>
        <View style={styles.divisor}></View>
        <FacturaItemsTable invoice={data} />
        <View style={styles.footer}>
          <View style={styles.row}>
            <View style={styles.column}>
              <Image style={styles.qr} src={qrBase64}/>
            </View>
            <View style={styles.column}>
              <Text style={styles.subtitle}>CAE N°: <Text style={styles.subtitleSpan}>{data.FacturaCodigoAutorizacion}</Text></Text>
              <Text style={styles.subtitle}>Fecha de Vto. de CAE: <Text style={styles.subtitleSpan}>{data.FacturaFechaVencimientoCodigoAutorizacion.split('-').reverse().join('/')}</Text></Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );

  export default FacturaCaratula;