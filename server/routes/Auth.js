const express = require('express');
const { check } = require('express-validator');
const ValidarJWT = require('../middlewares/ValidarJWT');
const router = express.Router();
const AuthController = require('./../controllers/AuthController');

router.post('/login', [
    //validarJWT,
    check('NombreUsuario', 'El nombre de usuario es obligatorio').not().isEmpty(),
    check('Contraseña', 'La contraseña es obligatoria').not().isEmpty()
], AuthController.UserGet);

//obtener un usuario autenticado al intentar loguear
router.get('/login',
    ValidarJWT,
    AuthController.UserAutenticate
);
module.exports = router;