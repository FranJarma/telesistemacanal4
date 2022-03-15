import DataTable from 'react-data-table-component';
import React, { useState, useEffect } from 'react';
import Spinner from './Spinner';
import Buscador from './Buscador';

const Datatable = ({loader, columnas, datos, expandedComponent, paginacion, buscar, seleccionable, fnSeleccionable, fnExpandible}) => {
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
    (item.createdAt && item.createdAt.toString().includes(textoFiltrado.toLowerCase()))
    || (item.createdBy && item.createdBy.toString().includes(textoFiltrado.toLowerCase()))
    || (item.Nombre && item.Nombre.toLowerCase().includes(textoFiltrado.toLowerCase()))
    || (item.Apellido && item.Apellido.toLowerCase().includes(textoFiltrado.toLowerCase()))
    || (item.NombreUsuario && item.NombreUsuario.toString().includes(textoFiltrado.toLowerCase()))
    || (item.Email && item.Email.toString().includes(textoFiltrado.toLowerCase()))
    || (item.Documento && item.Documento.toString().includes(textoFiltrado.toLowerCase()))
    || (item.BarrioNombre && item.BarrioNombre.toLowerCase().includes(textoFiltrado.toLowerCase()))
    || (item.MunicipioNombre && item.MunicipioNombre.toLowerCase().includes(textoFiltrado.toLowerCase()))
    || (item.DomicilioCalle && item.DomicilioCalle.toLowerCase().includes(textoFiltrado.toLowerCase()))
    || (item.DomicilioNumero && item.DomicilioNumero.toString().includes(textoFiltrado.toLowerCase()))
    || (item.ServicioNombre && item.ServicioNombre.toLowerCase().includes(textoFiltrado.toLowerCase()))
    || (item.ServicioDescripcion && item.ServicioDescripcion.toLowerCase().includes(textoFiltrado.toLowerCase()))
    || (item.MedioPagoNombre && item.MedioPagoNombre.toLowerCase().includes(textoFiltrado.toLowerCase()))
    || (item.MedioPagoDescripcion && item.MedioPagoDescripcion.toLowerCase().includes(textoFiltrado.toLowerCase()))
    || (item.MedioPagoInteres && item.MedioPagoInteres.toLowerCase().includes(textoFiltrado.toLowerCase()))
    || (item.OnuMac && item.OnuMac.toLowerCase().includes(textoFiltrado.toLowerCase()))
    || (item.OnuSerie && item.OnuSerie.toLowerCase().includes(textoFiltrado.toLowerCase()))
    || (item.ModeloOnuNombre && item.ModeloOnuNombre.toLowerCase().includes(textoFiltrado.toLowerCase()))
    || (item.PagoSaldo && item.PagoSaldo.toString().includes(textoFiltrado.toLowerCase()))
    || (item.PagoAño && item.PagoAño.toString().includes(textoFiltrado.toLowerCase()))
    || (item.PagoMes && item.PagoMes.toString().includes(textoFiltrado.toLowerCase()))
    || (item.PagoRecargo && item.PagoRecargo.toString().includes(textoFiltrado.toLowerCase()))
    || (item.PagoTotal && item.PagoTotal.toString().includes(textoFiltrado.toLowerCase()))
    || (item.DetallePagoMonto && item.DetallePagoMonto.toString().includes(textoFiltrado.toLowerCase()))
    || (item.RoleName && item.RoleName.toLowerCase().includes(textoFiltrado.toLowerCase()))
    || (item.RoleDescription && item.RoleDescription.toLowerCase().includes(textoFiltrado.toLowerCase()))
    || (item.TareaNombre && item.TareaNombre.toLowerCase().includes(textoFiltrado.toLowerCase()))
    || (item.OtId && item.OtId.toString().includes(textoFiltrado.toLowerCase()))
    || (item.OtFechaPrevistaVisita && item.OtFechaPrevistaVisita.toString().includes(textoFiltrado.toLowerCase()))
    || (item.MovimientoCantidad && item.MovimientoCantidad.toString().includes(textoFiltrado.toLowerCase()))
    || (item.FechaVencimientoServicio && item.FechaVencimientoServicio.toString().includes(textoFiltrado.toLowerCase()))
    || (item.NombreResponsableEjecucion && item.NombreResponsableEjecucion.toLowerCase().includes(textoFiltrado.toLowerCase()))
    || (item.ApellidoResponsableEjecucion && item.ApellidoResponsableEjecucion.toLowerCase().includes(textoFiltrado.toLowerCase()))
    || (item.NombreAbonado && item.NombreAbonado.toLowerCase().includes(textoFiltrado.toLowerCase()))
    || (item.ApellidoAbonado && item.ApellidoAbonado.toLowerCase().includes(textoFiltrado.toLowerCase()))
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
            pointerOnHover
            progressComponent={<Spinner/>}
            progressPending={loader ? cargando : false}
            selectableRows={seleccionable ? true : false}
            onSelectedRowsChange={row => fnSeleccionable(row.selectedRows)}
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
