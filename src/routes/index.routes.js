const express = require('express');
const authRoutes = require('./auth.routes');
const productRoutes = require('./product.routes');
const categoryRoutes = require('./category.routes');
const userRoutes = require('./user.routes');
const cartRoutes = require('./cart.routes');

const router = express.Router();

// Rutas de autenticación
router.use('/auth', authRoutes);

router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/users', userRoutes);
router.use('/cart', cartRoutes);

// Aquí se agregarán futuras rutas:
// router.use('/products', productRoutes);
// router.use('/orders', orderRoutes);
// router.use('/cart', cartRoutes);

module.exports = router;
