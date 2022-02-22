import compararFechas from "./CompararFechas";
import convertirAFecha from "./ConvertirAFecha";

const SpanVencimientoContrato = (timestamp) => {
    let hoy = new Date();

    let hoyLocal = ('0' + hoy.getDate()).slice(-2) + '/'
                 + ('0' + (hoy.getMonth()+1)).slice(-2) + '/'
                 + hoy.getFullYear();

    const fecha = convertirAFecha(timestamp.timestamp);

    const vencido = compararFechas(hoyLocal, fecha);

    if(vencido) {
        return <span title="Contrato vencido"><i style={{color: 'red'}} class='bx bxs-circle'></i> {fecha}</span>
    }
    else {
        return <span title="Contrato vigente"><i style={{color: 'green'}} class='bx bxs-circle'></i> {fecha}</span>
    }
}

export default SpanVencimientoContrato;