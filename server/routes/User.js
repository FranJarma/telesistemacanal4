const express = require('express');
const router = express.Router();
const UserController = require('./../controllers/UserController');
const { check } = require('express-validator');
const { esDNIValido, esCUITValido } =  require('./../helpers/db-validaciones');

router.get('/abonados/activos/', UserController.AbonadosActivosListar);
router.get('/abonados/inactivos/', UserController.AbonadosInactivosListar);
router.get('/abonados/domicilios/:id', UserController.AbonadoListarDomicilios);
router.get('/abonados/domicilio/:id', UserController.AbonadoUltimoDomicilio);

router.post('/abonados/create',
[   check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('apellido', 'El apellido es obligatorio').notEmpty(),
    check('dni', 'El DNI es obligatorio').notEmpty(),
    check('dni', 'El DNI no tiene el formato correcto, debe tener solo números').isNumeric(),
    check('dni', 'El DNI debe tener 7 dígitos como mínimo').isLength({min: 7}),
    check('dni').custom(esDNIValido),
    check('cuit', 'El CUIT es obligatorio').notEmpty(),
    check('cuit', 'El CUIT no tiene el formato correcto, debe tener solo números').isNumeric(),
    check('cuit', 'El CUIT debe tener 10 dígitos como mínimo').isLength({min: 10}),
    check('cuit').custom(esCUITValido),
    check('condicionIVASeleccionadoId', 'La condición IVA es obligatoria').not().contains(0),
    check('municipioSeleccionadoId', 'El municipio es obligatorio').not().contains(0),
    check('barrioSeleccionadoId', 'El barrio es obligatorio').not().contains(0),
    check('domicilioCalle', 'El nombre de domicilio es obligatorio').notEmpty(),
    check('domicilioNumero', 'El numero de domicilio es obligatorio').notEmpty(),
    check('servicioSeleccionadoId', 'El tipo de servicio es obligatorio').notEmpty(),
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