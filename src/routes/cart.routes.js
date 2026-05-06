const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const authorizeRoles = require('../middleware/authorizeRoles.middleware');
const cartController = require('../controllers/cart.controllers');

const router = express.Router();

router.get('/', authMiddleware, authorizeRoles('customer'), cartController.getMyCart);
router.post('/items', authMiddleware, authorizeRoles('customer'), cartController.addItem);
router.put('/items', authMiddleware, authorizeRoles('customer'), cartController.updateItemQuantity);
router.delete('/items/:productId', authMiddleware, authorizeRoles('customer'), cartController.removeItem);
router.delete('/', authMiddleware, authorizeRoles('customer'), cartController.clearCart);

module.exports = router;
