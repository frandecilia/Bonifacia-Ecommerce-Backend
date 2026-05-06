const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const userController = require('../controllers/user.controllers');

const router = express.Router();

router.get('/me', authMiddleware, userController.getMe);
router.put('/me', authMiddleware, userController.updateMe);

module.exports = router;
