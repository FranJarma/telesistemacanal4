import DataTable from 'react-data-table-component';
import React, { useState, useEffect } from 'react';
import Spinner from './Spinner';
import Buscador from './Buscador';

const Datatable = ({columnas, datos, expandedComponent}) => {
    //state y effect para spinner
    const [cargando, setCargando] = useState(true);
    useEffect(()=>{
        const timeout = setTimeout(()=>{
            setCargando(false);
        }, 2000);
        return () => clearTimeout(timeout);
    },[])
    //state para buscador
    const [textoFiltrado, setTextoFiltrado] = useState('');
    const itemsFiltrados = datos.filter(item =>
    (item.FullName && item.FullName.toLowerCase().includes(textoFiltrado.toLowerCase()))
    || (item.Documento && item.Documento.toLowerCase().includes(textoFiltrado.toLowerCase()))
    || (item.Barrio && item.Barrio.toLowerCase().includes(textoFiltrado.toLowerCase()))
    || (item.Domicilio && item.Domicilio.toLowerCase().includes(textoFiltrado.toLowerCase()))
    || (item.Servicio && item.Servicio.toLowerCase().includes(textoFiltrado.toLowerCase()))
    || (item.mes && item.mes.toLowerCase().includes(textoFiltrado.toLowerCase()))
    || (item.fechaPago && item.fechaPago.toLowerCase().includes(textoFiltrado.toLowerCase()))
    );
    const paginacionOpciones = {
        rowsPerPageText: 'Registros por página',
        rangeSeparatorText: 'de',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'Mostrar todos'
    }

    return (
        <DataTable
            columns={columnas}
            expandableRows
            expandableRowsComponent={expandedComponent}
            data={itemsFiltrados !== "" ? itemsFiltrados : datos}
            highlightOnHover
            noDataComponent="No se encontraron registros"
            pagination
            paginationComponentOptions={paginacionOpciones}
            progressComponent={<Spinner/>}
            progressPending={cargando}
            responsive
            subHeader
            subHeaderComponent={
                <Buscador onFiltrar={e => setTextoFiltrado(e.target.value)} textoFiltrado={textoFiltrado}/>
            }
        >
        </DataTable>
    );
}
 
export default Datatable;
