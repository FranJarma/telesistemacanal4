import { Tooltip } from "@material-ui/core";
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
    },
    {
        "name": "Vencimiento",
        "selector": row =>row["vencimiento"],
    },
    {
        "name": "Total mes",
        "selector": row =>"$" + row["total"],
    },
    {
        "name": "Pago completo",
        "selector": row => row["saldo"] === 0 ? <i style={{color: 'green'}} className="bx bx-check bx-md"></i> : <i style={{color: 'red'}} className="bx bx-x bx-md"></i>,
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
