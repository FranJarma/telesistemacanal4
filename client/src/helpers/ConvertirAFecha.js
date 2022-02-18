function convertirAFecha (timestamp) {
    return timestamp.split('T')[0].split('-').reverse().join('/');
}

export default convertirAFecha;