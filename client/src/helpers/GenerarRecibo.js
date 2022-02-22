function generarRecibo(data) {
    const fecha = new Date().toLocaleDateString();
    alert(`Monto: ${data.DetallePagoMonto}, Fecha: ${fecha}`);
}

export default generarRecibo;