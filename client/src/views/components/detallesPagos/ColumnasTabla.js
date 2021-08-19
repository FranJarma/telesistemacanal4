import { Tooltip, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

export const columnasDetallesPagos = [
    {
        "name": "N°",
        "selector": row =>row["id"],
        "width": '4rem'
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
        "selector": row => row["medioPago"],
        "width": '11rem'
    },
    {
        cell: (data) => 
        <>
        <Typography style={{color: "slategrey", cursor: 'pointer'}}><Tooltip title="Generar recibo"><i className="bx bxs-receipt bx-xs"></i></Tooltip></Typography>
        </>,
    }
]