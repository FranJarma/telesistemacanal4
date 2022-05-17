function formatDocumento (dni) {
    let dniString = dni.toString();
    if(dniString.length === 7) {
        dniString = dniString.slice(0,1) + "." + dniString.slice(1,4) + "." + dniString.slice(4,7);
    }
    if(dniString.length === 8) {
        dniString = dniString.slice(0,2) + "." + dniString.slice(2,5) + "." + dniString.slice(5,8);
    }
    return dniString;
}

export default formatDocumento;