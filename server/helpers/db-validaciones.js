const Onu = require('../models/Onu');
const User = require('./../models/User');

const esDNIValido = async (dni)=>{
    const existeDNI = await User.findOne({where: {Documento: dni}});
    if (existeDNI) throw new Error('El DNI ingresado ya se encuentra registrado');
}

const esCUITValido = async (cuit)=>{
    const existeCUIT = await User.findOne({where: {Cuit: cuit}});
    if (existeCUIT) throw new Error('El CUIT ya se encuentra registrado');
}

const esOnuValida = async (mac)=>{
    const existeOnu = await Onu.findOne({where: {OnuMac: mac}});
    if (existeOnu) throw new Error('La MAC de la Onu ya se encuentra registrada');
}

const esEmailValido = async (email)=>{
    const existeEmail = await User.findOne({where: {Email: email}});
    if (existeEmail) throw new Error('El email ya se encuentra registrado');
}

const esUserValido = async (nombreUsuario)=>{
    const existeUser = await User.findOne({where: {NombreUsuario: nombreUsuario}});
    if (existeUser) throw new Error('El nombre de usuario ya se encuentra registrado');
}

module.exports = {
    esDNIValido,
    esCUITValido,
    esUserValido,
    esEmailValido,
    esOnuValida
}