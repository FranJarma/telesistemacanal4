
import React, { useContext } from 'react';
import { Tooltip } from '@material-ui/core';
import AppContext from '../../../../context/appContext';
import ReciboCaratula from './ReciboCaratula';


const Recibo = ({data}) => {
  const appContext = useContext(AppContext);
  const { descargarComprobante } = appContext;

  return (
    <>
    <Tooltip title="Descargar recibo">
      <i style={{color: "navy"}} className='bx bx-file bx-xs' onClick={() => descargarComprobante("Recibo", <ReciboCaratula data={data}/>, data)}></i>
    </Tooltip>
    </>
  );
}

export default Recibo;