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
    (item.Nombre && item.Nombre.toLowerCase().includes(textoFiltrado.toLowerCase()))
    || (item.Apellido && item.Apellido.toString().includes(textoFiltrado.toLowerCase()))
    || (item.Documento && item.Documento.toString().includes(textoFiltrado.toLowerCase()))
    || (item.BarrioNombre && item.BarrioNombre.toLowerCase().includes(textoFiltrado.toLowerCase()))
    || (item.MunicipioNombre && item.MunicipioNombre.toLowerCase().includes(textoFiltrado.toLowerCase()))
    || (item.DomicilioCalle && item.DomicilioCalle.toLowerCase().includes(textoFiltrado.toLowerCase()))
    || (item.DomicilioNumero && item.DomicilioNumero.toString().includes(textoFiltrado.toLowerCase()))
    || (item.ServicioNombre && item.ServicioNombre.toLowerCase().includes(textoFiltrado.toLowerCase()))
    || (item.OnuMac && item.OnuMac.toLowerCase().includes(textoFiltrado.toLowerCase()))
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
            expandableRows = {expandedComponent ? true : false}
            expandableRowsComponent={expandedComponent ? expandedComponent : ''}
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
            striped
        >
        </DataTable>
    );
}
 
export default Datatable;
