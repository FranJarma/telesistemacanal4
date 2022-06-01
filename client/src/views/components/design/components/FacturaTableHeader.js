import React from 'react';
import {Font, Text, View, StyleSheet } from '@react-pdf/renderer';

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

const borderColor = '#e2e2e2'
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderBottomColor: borderColor,
        backgroundColor: borderColor,
        borderBottomWidth: 1,
        alignstyless: 'center',
        minHeight: 25,
        textAlign: 'center',
        flexGrow: 1,
        fontSize: 10,
        fontFamily: 'OpenSansBold'
    },
    codigo: {
        width: '10%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    producto: {
        width: '40%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    cantidad: {
        width: '10%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    unidadMedida: {
        width: '10%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    precioUnitario: {
        width: '20%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    porcentajeBonificacion: {
        width: '10%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    importeBonificacion: {
        width: '10%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    subtotal: {
        width: '20%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
  });

  const FacturaTableHeader = () => (
    <View style={styles.container}>
        <Text style={styles.codigo}>Código</Text>
        <Text style={styles.producto}>Producto  / Servicio</Text>
        <Text style={styles.cantidad}>Cantidad</Text>
        <Text style={styles.precioUnitario}>Precio Unitario</Text>
        <Text style={styles.subtotal}>Subtotal</Text>
    </View>
  );
  
  export default FacturaTableHeader