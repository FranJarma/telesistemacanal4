const User = require('./../models/User');
const Role = require('./../models/Role');
const UserRole = require('./../models/UserRole');
const { Op } = require("sequelize");

const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
require('dotenv').config({path: 'variables.env'});

exports.AbonadosActivosListar = async(req, res) => {
    try {
        const abonados = await User.findAll({
            attributes: ['UserId', 'FullName', 'Phone','Domicilio'],
            where: {
                'deactivateAt': null
            }
        });
        console.log(abonados)
        res.json(abonados);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al encontrar los abonados');
    }
}

exports.AbonadosInactivosListar = async(req, res) => {
    try {
        const abonados = await User.findAll({
            attributes: ['UserId', 'FullName', 'Phone','Domicilio'],
            where: {
                'deactivateAt': {
                    [Op.not]: null
                }
            }
        });
        console.log(abonados)
        res.json(abonados);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al encontrar los abonados');
    }
}

exports.AbonadoCreate = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
        const { email, dni } = req.body;
        let dniExists = User.findOne({dni}) || User.findOne({email});
        if (dniExists) res.status(400).json({mensaje: 'Ya existe un abonado con ese DNI o Email'});
        //creamos un nuevo abonado pasándole como info todo lo que traemos de la vista
        abonado = new User(req.body);
        //hasheamos password
        const passwordSalt = await bcrypt.genSalt(10);
        abonado.password = await bcrypt.hash(password, passwordSalt);
        await abonado.save();
        //creamos y firmamos jwt
        const payload = {
            abonado: {
                UserId: abonado.UserId
            }
        };
        //firmamos el token
        jwt.sign(payload, process.env.PALABRA_SECRETA,{
            expiresIn: 3600 //la sesión dura 1 hora
        },(error, token) =>{
            if (error) {
                throw(error);
            }
            else{
                //mensaje de confirmación
            res.json({token});
            }
        });
    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error en el registro');
    }
}

exports.AbonadoEliminar = async(req, res) => {
    res.status(200).send("Eliminar abonado")
}