const User = require('./../models/User');

const esDNIValido = async (dni)=>{
    const existeDNI = await User.findOne({where: {Documento: dni}});
    if (existeDNI) throw new Error('El DNI ingresado ya se encuentra registrado');
}

const esCUITValido = async (cuit)=>{
    const existeCUIT = await User.findOne({where: {Cuit: cuit}});
    if (existeCUIT) throw new Error('El CUIT ya se encuentra registrado');
}

module.exports = {
    esDNIValido,
    esCUITValido
}