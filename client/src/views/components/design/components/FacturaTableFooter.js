import React from 'react';
import {Text, View, StyleSheet } from '@react-pdf/renderer';

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
    description: {
        width: '100%',
        textAlign: 'right',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        paddingRight: 8,
    },
  });


const InvoiceTableFooter = ({items}) => {
    const total = items.map(item => Number.parseFloat(item.Cantidad) * Number.parseFloat(item.PrecioUnitario))
        .reduce((accumulator, currentValue) => accumulator + currentValue , 0)
    return(    
        <View style={styles.row}>
            <Text style={styles.description}>Subtotal:$ {total.toFixed(2)}</Text>
            <Text style={styles.description}>Importe Otros Tributos: $ 0,00</Text>
            <Text style={styles.description}>Importe Total: $ {total.toFixed(2)}</Text>
        </View>
    )
};
  
  export default InvoiceTableFooter