const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const authorizeRoles = require('../middleware/authorizeRoles.middleware');
const productController = require('../controllers/product.controllers');

const router = express.Router();

router.get('/', productController.findAll);
router.get('/:id', productController.findById);
router.post('/', authMiddleware, authorizeRoles('admin'), productController.create);
router.put('/:id', authMiddleware, authorizeRoles('admin'), productController.update);
router.delete('/:id', authMiddleware, authorizeRoles('admin'), productController.remove);

module.exports = router;
