function convertirAFecha (timestamp) {
    const hora = timestamp.split('T')[1].split(':')[0];
    let dia = timestamp.split('T')[0].split('-')[2];
    let mes = timestamp.split('T')[0].split('-')[1];
    let año = timestamp.split('T')[0].split('-')[0];
    if(parseInt(hora) >= 0 && parseInt(hora) <= 2){
        dia = dia - 1;
    }
    const diaFormateado = dia + "/" + mes + "/" + año;
    return diaFormateado;
}

export default convertirAFecha;