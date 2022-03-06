const compararFechas = (fecha1, fecha2) => {
    const arrayFecha1Split = fecha1.split('/');
    const arrayFecha2Split = fecha2.split('/');
    const concatenateFecha1 =  arrayFecha1Split.reduce(function (a, b) {return a + b;});
    const concatenateFecha2 =  arrayFecha2Split.reduce(function (a, b) {return a + b;});

    if(parseInt(concatenateFecha2) > parseInt(concatenateFecha1)) {
        return true;
    }
    else {
        return false;
    }
}

export default compararFechas;