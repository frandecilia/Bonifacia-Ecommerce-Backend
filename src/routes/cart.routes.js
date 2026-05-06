const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const cartController = require('../controllers/cart.controllers');

const router = express.Router();

router.get('/', authMiddleware, cartController.getMyCart);
router.post('/items', authMiddleware, cartController.addItem);
router.put('/items', authMiddleware, cartController.updateItemQuantity);
router.delete('/items/:productId', authMiddleware, cartController.removeItem);
router.delete('/', authMiddleware, cartController.clearCart);

module.exports = router;
