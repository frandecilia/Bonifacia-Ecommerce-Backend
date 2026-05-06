const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const authorizeRoles = require('../middleware/authorizeRoles.middleware');
const orderController = require('../controllers/order.controllers');

const router = express.Router();

router.post('/', authMiddleware, authorizeRoles('customer'), orderController.create);
router.get('/my', authMiddleware, authorizeRoles('customer'), orderController.getMyOrders);
router.put('/:orderId/status', authMiddleware, authorizeRoles('admin', 'customer'), orderController.updateStatus);

module.exports = router;
