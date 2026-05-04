const express = require('express');
const authRoutes = require('./auth.routes');

const router = express.Router();

// Rutas de autenticación
router.use('/auth', authRoutes);

// Aquí se agregarán futuras rutas:
// router.use('/products', productRoutes);
// router.use('/orders', orderRoutes);
// router.use('/cart', cartRoutes);

module.exports = router;
