
import React from 'react';
import { Font, PDFDownloadLink, Page, Document, StyleSheet, Image, Text, View } from '@react-pdf/renderer';
import { Tooltip } from '@material-ui/core';
import logo from './../../../images/logo-byn.png';
import logo2 from './../../../images/olinet-byn.png';

import { QRCodeCanvas } from 'qrcode.react';

Font.register({ family: 'SourceSansPro', fonts: [
  { src: 'https://fonts.gstatic.com/s/sourcesanspro/v14/6xK3dSBYKcSV-LCoeQqfX1RYOo3aPw.ttf' }, // font-style: normal, font-weight: normal
  { src: 'https://fonts.gstatic.com/s/sourcesanspro/v14/6xKydSBYKcSV-LCoeQqfX1RYOo3i54rAkA.ttf', fontWeight: 600 },
 ]});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'SourceSansPro',
    fontSize: 12,
    paddingTop: 30,
    paddingLeft:50,
    paddingRight:50,
    lineHeight: 1.5,
    flexDirection: 'column',
    border: '#000'
  }, 
  logo: {
      width: 100,
      height: 100,
      position: 'relative',
      bottom: 35
  },
  qr: {
    width: 100,
    height: 100,
    padding: 10
  },
  title: {
    textTransform: 'uppercase',
    fontSize: 18,
    fontWeight: 'bold'
  },
  subtitle: {
    fontWeight: 'bold',
    fontSize: 10,
    padding: 5
  },
  verticalLine: {
    borderLeft: '2px solid black',
    height: 30,
    marginLeft: 15
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
  divisor: {
    borderTop: '1px solid black'
  }
});

const QrBase64 = () => {
  const qrCodeCanvas = document.querySelector('canvas');
  const qrCodeDataUri = qrCodeCanvas.toDataURL('image/jpg', 0.3);
  return qrCodeDataUri;
}

const MyDoc = (tipo) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.row} fixed>
        <Text style={styles.title}>Tele sistema SRL - Factura B</Text>
        <View style={styles.verticalLine}></View>
        <Image style={styles.logo} src={logo}/>
        <Image style={styles.logo} src={logo2}/>
      </View>
      <View style={styles.divisor}></View>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.subtitle}>Razón social: TELE SISTEMA SRL</Text>
          <Text style={styles.subtitle}>Domicilio Comercial: Av Jujuy 428 - Perico, Jujuy</Text>
          <Text style={styles.subtitle}>Condición frente al IVA: IVA Responsable Inscripto</Text>
          <Text style={styles.subtitle}>CUIT: 30687336506</Text>
          <Text style={styles.subtitle}>Ingresos brutos: B-2-2784</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.subtitle}>Punto de venta: 00002</Text>
          <Text style={styles.subtitle}>Comp N°: 0011983</Text>
          <Text style={styles.subtitle}>Fecha de Emisión: 13/05/2022</Text>
          <Text style={styles.subtitle}>Fecha de Inicio de Actividades: 01/03/1996</Text>
        </View>
      </View>
      <View style={styles.divisor}></View>
      <View style={styles.row}>
        <Text style={styles.subtitle}>Desde: 13/05/2022</Text>
        <Text style={styles.subtitle}>Hasta: 13/05/2022</Text>
        <Text style={styles.subtitle}>Vencimiento del pago: 13/05/2022</Text>
      </View>
      <View style={styles.divisor}></View>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.subtitle}>Doc: - </Text>
          <Text style={styles.subtitle}>Condición frente al IVA: Consumidor Final</Text>
          <Text style={styles.subtitle}>Condición de venta: Contado</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.subtitle}>Apellido y Nombre / Razón Social: Test, Test</Text>
          <Text style={styles.subtitle}>Domicilio: Calle Falsa 123</Text>
        </View>
      </View>
      <View style={styles.divisor}></View>
      <Image style={styles.qr} src={QrBase64}/>
      <View style={styles.divisor}></View>
    </Page>
  </Document>
);


const Factura = () => {
  return (
    <>
    <QRCodeCanvas style={{display: 'none'}} value = {'https://erikmartinjordan.com'}/>
    <PDFDownloadLink document={<MyDoc />} fileName="Factura.pdf">
    {({ blob, url, loading, error }) => loading ? 'Cargando...' : <Tooltip title="Descargar factura"><i style={{color: "teal"}} className='bx bxs-file-pdf bx-sm'></i></Tooltip>}
    </PDFDownloadLink></>
  );
}

export default Factura;