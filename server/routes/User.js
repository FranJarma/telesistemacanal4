const express = require('express');
const router = express.Router();
const UserController = require('./../controllers/UserController');
const User = require('./../models/User');

const { check } = require('express-validator');
const { Op } = require('sequelize');

router.get('/abonados/activos/', UserController.AbonadosActivosListar);
router.get('/abonados/inactivos', UserController.AbonadosInactivosListar);

router.post('/abonados/create',
[       check('nombre', 'El nombre es obligatorio').notEmpty(),
        check('apellido', 'El apellido es obligatorio').notEmpty(),
        check('dni', 'El DNI es obligatorio').notEmpty(),
        check('dni', 'El DNI no tiene el formato correcto, debe tener solo números').isNumeric(),
        check('dni', 'El DNI debe tener 7 dígitos como mínimo').isLength({min: 7}),
        check('dni').custom(dni=>{
            return User.findOne({where: {Documento: dni}}).then(user=>{
                if (user) throw new Error('El DNI ingresado ya se encuentra registrado');
            })
        }),
        check('cuit', 'El CUIT es obligatorio').notEmpty(),
        check('cuit', 'El CUIT no tiene el formato correcto, debe tener solo números').isNumeric(),
        check('cuit', 'El CUIT debe tener 10 dígitos como mínimo').isLength({min: 10}),
        check('cuit').custom(cuit=>{
            return User.findOne({where: {Cuit: cuit}}).then(user=>{
                if (user) throw new Error('El CUIT ya se encuentra registrado');
            })
        }),
        check('condicionIVASeleccionadoId', 'La condición IVA es obligatoria').notEmpty(),
        check('municipioSeleccionadoId', 'El municipio es obligatorio').notEmpty(),
        check('barrioSeleccionadoId', 'El barrio es obligatorio').notEmpty(),
        check('domicilioCalle', 'El nombre de domicilio es obligatorio').notEmpty(),
        check('domicilioNumero', 'El numero de domicilio es obligatorio').notEmpty(),
        check('servicioSeleccionadoId', 'El tipo de servicio es obligatorio').notEmpty(),
],UserController.AbonadoCreate);

router.put('/abonados/update/:id',
[       check('nombre', 'El nombre es obligatorio').notEmpty(),
        check('apellido', 'El apellido es obligatorio').notEmpty(),
        check('dni', 'El DNI es obligatorio').notEmpty(),
        check('dni', 'El DNI no tiene el formato correcto, debe tener solo números').isNumeric(),
        check('dni', 'El DNI debe tener 7 dígitos como mínimo').isLength({min: 7}),
        check('cuit', 'El CUIT es obligatorio').notEmpty(),
        check('cuit', 'El CUIT no tiene el formato correcto, debe tener solo números').isNumeric(),
        check('cuit', 'El CUIT debe tener 10 dígitos como mínimo').isLength({min: 10}),
        check('condicionIVASeleccionadoId', 'La condición IVA es obligatoria').notEmpty(),
],UserController.AbonadoUpdate);

router.get('/delete/:id', UserController.UserEliminar);

module.exports = router;