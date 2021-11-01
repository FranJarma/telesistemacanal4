import DataTable from 'react-data-table-component';
import React, { useState, useEffect } from 'react';
import Spinner from './Spinner';
import Buscador from './Buscador';

const Datatable = ({columnas, datos, expandedComponent, paginacion, buscar}) => {
    //state y effect para spinner
    const [cargando, setCargando] = useState(true);
    useEffect(()=>{
        const timeout = setTimeout(()=>{
            setCargando(false);
        }, 2500);
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
    || (item.OnuSerie && item.OnuSerie.toLowerCase().includes(textoFiltrado.toLowerCase()))
    || (item.ModeloOnuNombre && item.ModeloOnuNombre.toLowerCase().includes(textoFiltrado.toLowerCase()))
    || (item.PagoSaldo && item.PagoSaldo.toString().includes(textoFiltrado.toLowerCase()))
    || (item.PagoPeriodo && item.PagoPeriodo.toString().includes(textoFiltrado.toLowerCase()))
    || (item.PagoRecargo && item.PagoRecargo.toString().includes(textoFiltrado.toLowerCase()))
    || (item.PagoTotal && item.PagoTotal.toString().includes(textoFiltrado.toLowerCase()))
    || (item.DetallePagoMonto && item.DetallePagoMonto.toString().includes(textoFiltrado.toLowerCase()))
    || (item.DetallePagoFecha && item.DetallePagoFecha.toString().includes(textoFiltrado.toLowerCase()))
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
            pagination = {paginacion ? true : false}
            paginationComponentOptions={paginacion ? paginacionOpciones : ""}
            progressComponent={<Spinner/>}
            progressPending={cargando}
            responsive
            subHeader = {buscar ? true : false}
            subHeaderComponent={
                buscar ? 
                <Buscador onFiltrar={e => setTextoFiltrado(e.target.value)} textoFiltrado={textoFiltrado}/>
                : ""
            }
            striped
        >
        </DataTable>
    );
}
 
export default Datatable;
