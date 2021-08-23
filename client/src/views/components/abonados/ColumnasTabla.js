import { Tooltip } from "@material-ui/core";
import { Link } from "react-router-dom";
export const columnasAbonadosActivos = [
    {
        "name": "id",
        "omit": true,
        "selector": row =>row["UserId"],
        "sortable": true
    },
    {
        "name": "Nombre Completo",
        "selector": row =>row["FullName"],
        "sortable": true,
        "width": '11rem'
    },
    {
        "name": "N° teléfono",
        "selector": row =>row["Phone"],
        "sortable": true
    },
    {
        "name": "Domicilio",
        "selector": row =>row["Domicilio"],
        "sortable": true,
    },
    {
        cell: (data) =>
        <>
        <Link to={{
            pathname: `/caratula-abonado/nombre=${data.FullName}`,
            state: data
        }}
        style={{textDecoration: 'none', color: "teal"}}>
        <Tooltip title="Editar"><i className="bx bx-edit bx-xs"></i></Tooltip>
        </Link>
        <Link to={{
            pathname: `/historial-de-pagos/abonado=${data.FullName}`,
            state: data
        }}
        style={{textDecoration: 'none', color: "navy"}}>
        <Tooltip title="Ver historial de pagos"><i className="bx bx-list-ul bx-xs"></i></Tooltip>
        </Link>
        <Link to="/caratula-abonado/edit" style={{textDecoration: 'none', color: "red"}}><Tooltip title="Dar de baja"><i className="bx bx-trash bx-xs"></i></Tooltip></Link>
        </>,
    }
]

export const columnasAbonadosInactivos = [
    {
        "name": "N°",
        "selector": row =>row["id"],
        "sortable": true,
        "width": '4rem'
    },
    {
        "name": "Nombre Completo",
        "selector": row =>row["nombreCompleto"],
        "sortable": true,
        "width": '11rem'
    },
    {
        "name": "N° teléfono",
        "selector": row =>row["telefono"],
        "sortable": true,
        "width": '9rem'
    },
    {
        "name": "Barrio - Dirección",
        "selector": row =>row["domicilio"]["barrio"] + " - " + row["domicilio"]["calle"] + " " +  row["domicilio"]["numero"] ,
        "sortable": true,
    },
    {
        "name": "Servicio",
        "selector": row =>row["servicio"],
        "sortable": true,
        "width": '10rem'
    },
    {
        "name": "Motivo",
        "selector": row =>row["motivo"],
    },
    {
        cell: (data) =>
        <>
        <Link to="" style={{textDecoration: 'none', color: "teal"}}><Tooltip title="Dar de alta"><i className="bx bxs-check-square bx-sm"></i></Tooltip></Link>
        </>,
    }
]

