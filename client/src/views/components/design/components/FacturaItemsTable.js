
import React from 'react';
import {View, StyleSheet } from '@react-pdf/renderer';
import FacturaTableHeader from './FacturaTableHeader'
import FacturaTableRow from './FacturaTableRow'
import FacturaTableFooter from './FacturaTableFooter'

const styles = StyleSheet.create({
    tableContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 25,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: '#e2e2e2',
    },
    cooterContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 25,
      marginBottom: 25,
      borderWidth: 1,
      borderColor: '#e2e2e2',
      backgroundColor: '#e2e2e2'
  },
});

  const FacturaItemsTable = ({invoice}) => (
    <>
    <View style={styles.tableContainer}>
        <FacturaTableHeader />
        <FacturaTableRow items={invoice.items} />
    </View>
    <View style={styles.cooterContainer}>
        <FacturaTableFooter items={invoice.items} />
    </View>
    </>
  );
  
  export default FacturaItemsTable