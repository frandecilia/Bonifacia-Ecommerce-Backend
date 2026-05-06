const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const customerController = require('../controllers/customer.controllers');

const router = express.Router();

router.get('/me', authMiddleware, customerController.getMe);
router.put('/me', authMiddleware, customerController.updateMe);

module.exports = router;
