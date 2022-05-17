function convertirAHora (timestamp) {
    let hora = timestamp.split('T')[1].split(':')[0];
    let minutos = timestamp.split('T')[1].split(':')[1];
    if(parseInt(hora) >= 0 && parseInt(hora) < 4) {
        hora = parseInt(hora) + 21
    }
    else {
        hora = hora - 3;
    }
    return (hora + ":" + minutos);
}

export default convertirAHora;