import React from 'react';
import {Font, Text, StyleSheet } from '@react-pdf/renderer';

import OpenSans from '../../../../fonts/OpenSans.ttf'
import OpenSansBold from '../../../../fonts/OpenSansBold.ttf'

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
    row: {
        flexDirection: 'row',
        borderBottomColor: borderColor,
        borderBottomWidth: 1,
        alignItems: 'center',
        height: 24,
        fontSize: 10,
    },
    subtitle: {
        width: '100%',
        textAlign: 'right',
        padding: 8,
        fontFamily: 'OpenSansBold',
    },
    subtitleSpan: {
        fontFamily: 'OpenSans',
    }
  });


const InvoiceTableFooter = ({items}) => {
    const total = items.map(item => Number.parseFloat(item.Cantidad) * Number.parseFloat(item.PrecioUnitario))
        .reduce((accumulator, currentValue) => accumulator + currentValue , 0)
    return(
        <>
            <Text style={styles.subtitle}>Subtotal: <Text style={styles.subtitleSpan}> ${total.toFixed(2)}</Text></Text>
            <Text style={styles.subtitle}>Importe Otros Tributos: <Text style={styles.subtitleSpan}> $0,00 </Text></Text>
            <Text style={styles.subtitle}>Importe Total: <Text style={styles.subtitleSpan}> ${total.toFixed(2)}</Text></Text>
        </>
    )
};
  
  export default InvoiceTableFooter