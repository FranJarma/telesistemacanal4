import { Tooltip } from "@material-ui/core";
import { Link } from "react-router-dom";

export const columnasPagos = [
    {
        "name": "N°",
        "selector": row =>row["id"],
        "width": '4rem'
    },
    {
        "name": "Período",
        "selector": row =>row["mes"]+ " de " +row["año"],
        "sortable": true,
        "width": '12rem'
    },
    {
        "name": "Vencimiento",
        "selector": row =>row["vencimiento"],
        "width": '11rem'
    },
    {
        "name": "Total mes",
        "selector": row =>"$" + row["total"],
        "width": '11rem'
    },
    {
        "name": "Pago completo",
        "selector": row => row["saldo"] === 0 ? <i style={{color: 'green'}} className="bx bx-check bx-md"></i> : <i style={{color: 'red'}} className="bx bx-x bx-md"></i>,
        "width": '11rem'
    },
    {
        cell: (data) =>
        <>
        <Link to={{
            pathname: `/detalles-pago/pagoId=${data.id}`,
            state: data
        }} style={{textDecoration: 'none', color: "navy"}}><Tooltip title="Detalles de pago"><i className="bx bx-list-ul bx-xs"></i></Tooltip></Link>
        <Link to={{
            pathname: `/caratula-abonado/abonadoId=${data.id}`,
            state: data
        }} style={{textDecoration: 'none', color: "teal"}}><Tooltip title="Generar factura"><i className="bx bxs-file-pdf bx-xs"></i></Tooltip></Link>
        </>,
    }
]
