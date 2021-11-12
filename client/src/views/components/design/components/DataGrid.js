import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const DataGrid = ({rows, columns, checkboxSelection}) => {
    return (
    <div style={{ height: 400, width: '100%' }}>
    <DataGrid
      rows={rows}
      columns={columns}
      checkboxSelection
    />
  </div> );
}
 
export default DataGrid;
