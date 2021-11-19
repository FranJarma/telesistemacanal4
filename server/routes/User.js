const express = require('express');
const router = express.Router();
const UserController = require('./../controllers/UserController');
const { check } = require('express-validator');
const { esDNIValido, esCUITValido, esUserValido, esEmailValido } =  require('./../helpers/db-validaciones');
const ValidarJWT = require('../middlewares/ValidarJWT');

router.get('/estado=:estadoId', ValidarJWT, UserController.UsersGet);
router.get('/abonados/municipio=:municipioId&estado=:estadoId', ValidarJWT, UserController.AbonadosGet);
router.get('/abonados/domicilios/:id', ValidarJWT, UserController.AbonadoListarDomicilios);
router.get('/abonados/servicios/:id', ValidarJWT, UserController.AbonadoListarServicios);

router.post('/create', ValidarJWT,
[
    check('Nombre', 'El nombre es obligatorio').notEmpty(),
    check('Apellido', 'El apellido es obligatorio').notEmpty(),
    check('Documento', 'El DNI es obligatorio').notEmpty(),
    check('Documento', 'El DNI no tiene el formato correcto, debe tener solo números').isNumeric(),
    check('Documento', 'El DNI debe tener 7 dígitos como mínimo').isLength({min: 7}),
    check('Email', 'El correo es obligatorio').notEmpty(),
    check('Email', 'El correo no tiene el formato correcto').isEmail(),
    check('Email').custom(esEmailValido),
    check('NombreUsuario', 'El nombre de usuario es obligatorio').notEmpty(),
    check('NombreUsuario').custom(esUserValido),
    check('Contraseña', 'La contraseña es obligatoria').notEmpty(),
    check('RContraseña', 'Ingrese de nuevo la contraseña').notEmpty(),
    check('RolesSeleccionados', 'Seleccione roles desde el menú Roles').notEmpty(),
    
], UserController.UserCreate);

router.put('/update/:id', ValidarJWT,
[   check('Nombre', 'El nombre es obligatorio').notEmpty(),
    check('Apellido', 'El apellido es obligatorio').notEmpty(),
    check('Documento', 'El DNI es obligatorio').notEmpty(),
    check('Documento', 'El DNI no tiene el formato correcto, debe tener solo números').isNumeric(),
    check('Documento', 'El DNI debe tener 7 dígitos como mínimo').isLength({min: 7}),
    check('Email', 'El correo es obligatorio').notEmpty(),
    check('Email', 'El correo no tiene el formato correcto').isEmail(),
    check('NombreUsuario', 'El nombre de usuario es obligatorio').notEmpty()
],UserController.UserUpdate);

router.put('/delete/:id', UserController.UserDelete);

router.post('/abonados/create', ValidarJWT,
[   check('Nombre', 'El nombre es obligatorio').notEmpty(),
    check('Apellido', 'El apellido es obligatorio').notEmpty(),
    check('Documento', 'El DNI es obligatorio').notEmpty(),
    check('Documento', 'El DNI no tiene el formato correcto, debe tener solo números').isNumeric(),
    check('Documento', 'El DNI debe tener 7 dígitos como mínimo').isLength({min: 7}),
    check('Documento').custom(esDNIValido),
    check('Cuit', 'El CUIT es obligatorio').notEmpty(),
    check('Cuit', 'El CUIT no tiene el formato correcto, debe tener solo números').isNumeric(),
    check('Cuit', 'El CUIT debe tener 10 dígitos como mínimo').isLength({min: 10}),
    check('Cuit').custom(esCUITValido),
    check('CondicionIVAId', 'La condición IVA es obligatoria').not().contains(0),
    check('MunicipioId', 'El municipio es obligatorio').not().contains(0),
    check('BarrioId', 'El barrio es obligatorio').not().contains(0),
    check('DomicilioCalle', 'La calle del domicilio es obligatoria').notEmpty(),
    check('DomicilioNumero', 'El numero de domicilio es obligatorio').notEmpty(),
    check('ServicioId', 'El tipo de servicio es obligatorio').notEmpty(),
], UserController.AbonadoCreate);

router.put('/abonados/update/:id', ValidarJWT,
[   check('Nombre', 'El nombre es obligatorio').notEmpty(),
    check('Apellido', 'El apellido es obligatorio').notEmpty(),
    check('Documento', 'El DNI es obligatorio').notEmpty(),
    check('Documento', 'El DNI no tiene el formato correcto, debe tener solo números').isNumeric(),
    check('Documento', 'El DNI debe tener 7 dígitos como mínimo').isLength({min: 7}),
    check('Cuit', 'El CUIT es obligatorio').notEmpty(),
    check('Cuit', 'El CUIT no tiene el formato correcto, debe tener solo números').isNumeric(),
    check('Cuit', 'El CUIT debe tener 10 dígitos como mínimo').isLength({min: 10}),
    check('CondicionIVAId', 'La condición IVA es obligatoria').not().contains(0),
],UserController.AbonadoUpdate);

router.put('/abonados/cambiar-estado/:id', ValidarJWT, UserController.AbonadoCambiarEstado);

router.put('/abonados/cambio-domicilio/:id', ValidarJWT,
[
    check('MunicipioId', 'El municipio es obligatorio').not().contains(0),
    check('BarrioId', 'El barrio es obligatorio').not().contains(0),
    check('DomicilioCalle', 'La calle del domicilio es obligatoria').notEmpty(),
    check('DomicilioNumero', 'El numero de domicilio es obligatorio').notEmpty(),
    check('CambioDomicilioObservaciones', 'Es conveniente no dejar el campo observaciones vacío, para que el técnico responsable sepa las tareas a realizar').notEmpty()
],UserController.AbonadoCambioDomicilio);

router.put('/abonados/cambio-servicio/:id', ValidarJWT,
[
    check('ServicioId', 'El servicio es obligatorio').not().contains(0),
    check('CambioServicioObservaciones', 'Es conveniente no dejar el campo observaciones vacío, para que el técnico responsable sepa las tareas a realizar').notEmpty()
],UserController.AbonadoCambioServicio);

router.put('/abonados/cambio-titularidad/:id', ValidarJWT,
[
    check('Nombre', 'El nombre es obligatorio').notEmpty(),
    check('Apellido', 'El apellido es obligatorio').notEmpty(),
    check('Documento', 'El DNI es obligatorio').notEmpty(),
    check('Documento', 'El DNI no tiene el formato correcto, debe tener solo números').isNumeric(),
    check('Documento', 'El DNI debe tener 7 dígitos como mínimo').isLength({min: 7}),
    check('Documento').custom(esDNIValido),
    check('Cuit', 'El CUIT es obligatorio').notEmpty(),
    check('Cuit', 'El CUIT no tiene el formato correcto, debe tener solo números').isNumeric(),
    check('Cuit', 'El CUIT debe tener 10 dígitos como mínimo').isLength({min: 10}),
    check('Cuit').custom(esCUITValido),
    check('CondicionIVAId', 'La condición IVA es obligatoria').not().contains(0),
    check('MunicipioId', 'El municipio es obligatorio').not().contains(0),
    check('BarrioId', 'El barrio es obligatorio').not().contains(0),
    check('DomicilioCalle', 'La calle del domicilio es obligatoria').notEmpty(),
    check('DomicilioNumero', 'El numero de domicilio es obligatorio').notEmpty(),
],UserController.AbonadoCambioTitularidad);

module.exports = router;