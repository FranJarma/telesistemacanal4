import { Tooltip, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

export const columnasPagos = [
    {
        "name": "N°",
        "selector": row =>row["id"],
        "omit": true
    },
    {
        "name": "Período",
        "selector": row =>row["mes"]+ " de " +row["año"],
        "sortable": true,
        "wrap": true
    },
    {
        "name": "Total mes",
        "selector": row =>"$" + row["total"],
        "wrap": true
    },
    {
        "name": "Completo",
        "selector": row => row["saldo"] === 0 ? <i style={{color: 'green'}} className="bx bx-check bx-md"></i> : <i style={{color: 'red'}} className="bx bx-x bx-md"></i>,
        "wrap": true
    },
    {
        cell: (data) =>
        <>
        <Link to={{
            pathname: `/caratula-abonado/abonadoId=${data.id}`,
            state: data
        }} style={{textDecoration: 'none', color: "teal"}}><Tooltip title="Generar factura"><i className="bx bxs-file-pdf bx-sm"></i></Tooltip></Link>
        </>,
    }
]

export const columnasDetallesPagos = [
    {
        "name": "N°",
        "selector": row =>row["id"],
        "omit": true
    },
    {
        "name": "Monto",
        "selector": row =>"$" + row["monto"],
        "width": '12rem'
    },
    {
        "name": "Fecha de Pago",
        "selector": row =>row["fechaPago"],
    },
    {
        "name": "Forma de pago",
        "selector": row => row["formaPago"],
        "width": '11rem'
    },
    {
        cell: (data) => 
        <>
        <Typography style={{color: "slategrey", cursor: 'pointer'}}><Tooltip title="Generar recibo"><i className="bx bxs-receipt bx-xs"></i></Tooltip></Typography>
        </>,
    }
]
