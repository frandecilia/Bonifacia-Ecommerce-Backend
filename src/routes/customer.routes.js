const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const authorizeRoles = require('../middleware/authorizeRoles.middleware');
const customerController = require('../controllers/customer.controllers');

const router = express.Router();

router.get('/me', authMiddleware, authorizeRoles('admin', 'customer'), customerController.getMe);
router.put('/me', authMiddleware, authorizeRoles('admin', 'customer'), customerController.updateMe);

module.exports = router;
