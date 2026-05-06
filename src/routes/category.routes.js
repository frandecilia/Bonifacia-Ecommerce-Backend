const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const authorizeRoles = require('../middleware/authorizeRoles.middleware');
const categoryController = require('../controllers/category.controllers');

const router = express.Router();

router.get('/', categoryController.findAll);
router.get('/:id', categoryController.findById);
router.post('/', authMiddleware, authorizeRoles('admin'), categoryController.create);
router.put('/:id', authMiddleware, authorizeRoles('admin'), categoryController.update);
router.delete('/:id', authMiddleware, authorizeRoles('admin'), categoryController.remove);

module.exports = router;
