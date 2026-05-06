const express = require('express');
const authController = require('../controllers/auth.controllers');
const router = express.Router();

// Rutas de autenticación
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/verify', authController.verifyToken);

module.exports = router;
