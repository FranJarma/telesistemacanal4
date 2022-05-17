import convertirAFecha from "./ConvertirAFecha";

const SpanVencimientoServicio = (timestamp) => {
    const fecha = Date.parse(timestamp.timestamp);
    const hoy = Date.parse(new Date());

    if(hoy > fecha) {
        return <span title="Servicio vencido"><i style={{color: 'red'}} className='bx bxs-circle'></i> {convertirAFecha(timestamp.timestamp)}</span>
    }
    else {
        return <span title="Servicio vigente"><i style={{color: 'green'}} className='bx bxs-circle'></i> {convertirAFecha(timestamp.timestamp)}</span>
    }
}

export default SpanVencimientoServicio;
