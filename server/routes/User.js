const express = require('express');
const router = express.Router();
const UserController = require('./../controllers/UserController');
const User = require('./../models/User');

const { check } = require('express-validator');

router.get('/abonados/activos/', UserController.AbonadosActivosListar);
router.get('/abonados/inactivos/', UserController.AbonadosInactivosListar);
router.get('/abonados/domicilios/:id', UserController.AbonadoListarDomicilios);
router.get('/abonados/domicilio/:id', UserController.AbonadoUltimoDomicilio);

router.post('/abonados/create',
[   check('Nombre', 'El nombre es obligatorio').notEmpty(),
    check('Apellido', 'El apellido es obligatorio').notEmpty(),
    check('Documento', 'El DNI es obligatorio').notEmpty(),
    check('Documento', 'El DNI no tiene el formato correcto, debe tener solo números').isNumeric(),
    check('Documento', 'El DNI debe tener 7 dígitos como mínimo').isLength({min: 7}),
    check('Documento').custom(dni=>{
        return User.findOne({where: {Documento: dni}}).then(user=>{
            if (user) throw new Error('El DNI ingresado ya se encuentra registrado');
        })
    }),
    check('Cuit', 'El CUIT es obligatorio').notEmpty(),
    check('Cuit', 'El CUIT no tiene el formato correcto, debe tener solo números').isNumeric(),
    check('Cuit', 'El CUIT debe tener 10 dígitos como mínimo').isLength({min: 10}),
    check('Cuit').custom(cuit=>{
        return User.findOne({where: {Cuit: cuit}}).then(user=>{
            if (user) throw new Error('El CUIT ya se encuentra registrado');
        })
    }),
    check('CondicionIVAId', 'La condición IVA es obligatoria').not().contains(0),
    check('MunicipioId', 'El municipio es obligatorio').not().contains(0),
    check('BarrioId', 'El barrio es obligatorio').not().contains(0),
    check('DomicilioCalle', 'El nombre de domicilio es obligatorio').notEmpty(),
    check('DomicilioNumero', 'El numero de domicilio es obligatorio').notEmpty(),
    check('ServicioId', 'El tipo de servicio es obligatorio').notEmpty(),
],UserController.AbonadoCreate);

router.put('/abonados/update/:id',
[   check('Nombre', 'El nombre es obligatorio').notEmpty(),
    check('Apellido', 'El apellido es obligatorio').notEmpty(),
    check('Documento', 'El DNI es obligatorio').notEmpty(),
    check('Documento', 'El DNI no tiene el formato correcto, debe tener solo números').isNumeric(),
    check('Documento', 'El DNI debe tener 7 dígitos como mínimo').isLength({min: 7}),
    check('Cuit', 'El CUIT es obligatorio').notEmpty(),
    check('Cuit', 'El CUIT no tiene el formato correcto, debe tener solo números').isNumeric(),
    check('Cuit', 'El CUIT debe tener 10 dígitos como mínimo').isLength({min: 10}),
    check('CondicionIVAId', 'La condición IVA es obligatoria').notEmpty(),
],UserController.AbonadoUpdate);

router.put('/abonados/delete/:id', UserController.AbonadoDelete);

router.put('/abonados/cambio-domicilio/:id',
[
    check('MunicipioId', 'El municipio es obligatorio').not().contains(0),
    check('BarrioId', 'El barrio es obligatorio').not().contains(0),
    check('DomicilioCalle', 'El nombre de domicilio es obligatorio').notEmpty(),
    check('DomicilioNumero', 'El numero de domicilio es obligatorio').notEmpty(),
],UserController.AbonadoCambioDomicilio);

module.exports = router;