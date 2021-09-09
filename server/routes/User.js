const express = require('express');
const router = express.Router();
const UserController = require('./../controllers/UserController');
const User = require('./../models/User');
const { check } = require('express-validator');

router.get('/abonados/activos', UserController.AbonadosActivosListar);
router.get('/abonados/inactivos', UserController.AbonadosInactivosListar);
router.post('/abonados/create',
    [   check('nombre', 'El nombre es obligatorio').notEmpty(),
        check('apellido', 'El apellido es obligatorio').notEmpty(),
        check('dni', 'El DNI es obligatorio').notEmpty(),
        check('cuit', 'El CUIT es obligatorio').notEmpty(),
        check('email', 'El email es obligatorio').notEmpty(),
        check('telefono', 'El telefono es obligatorio').notEmpty(),
        check('domicilioCalle', 'El nombre de domicilio es obligatorio').notEmpty(),
        check('domicilioNumero', 'El numero de domicilio es obligatorio').notEmpty(),
        check('condicionIVASeleccionadoId', 'La condición IVA es obligatoria').notEmpty(),
        check('municipioSeleccionadoId', 'El domicilio es obligatorio').notEmpty(),
        check('barrioSeleccionadoId', 'El barrio es obligatorio').notEmpty(),
        check('servicioSeleccionadoId', 'El tipo de servicio es obligatorio').notEmpty(),
        check('dni', 'El DNI no tiene el formato correcto').isNumeric(),
        check('dni', 'El DNI debe tener 7 dígitos como mínimo').isLength({min: 7}),
        check('cuit', 'El CUIT no tiene el formato correcto').isNumeric(),
        check('cuit', 'El CUIT debe tener 10 dígitos como mínimo').isLength({min: 10}),
        check('telefono', 'El Teléfono no tiene el formato correcto').isNumeric(),
        check('email', 'El email no tiene el formato correcto').isEmail(),
        check('email', 'El email ya se encuentra registrado').custom(value=>{
            return User.findOne({where: {Email: value}}).then(user=>{
                if (user) throw new Error('El email ya se encuentra en uso');
            })
        }),
        check('dni', 'El DNI ingresado ya se encuentra registrado').custom(value=>{
            return User.findOne({where: {Documento: value}}).then(user=>{
                if (user) throw new Error('El DNI ingresado ya se encuentra registrado');
            })
        }),
        check('cuit', 'El CUIT ya se encuentra registrado').custom(value=>{
            return User.findOne({where: {Cuit: value}}).then(user=>{
                if (user) throw new Error('El CUIT ya se encuentra registrado');
            })
        }),
    ],UserController.AbonadoCreate);
    
router.get('/delete/:id', UserController.UserEliminar);

module.exports = router;