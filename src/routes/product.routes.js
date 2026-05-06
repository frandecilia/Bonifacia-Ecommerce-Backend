const express = require('express');
const productController = require('../controllers/product.controllers');

const router = express.Router();

router.post('/', productController.create);
router.get('/', productController.findAll);
router.get('/:id', productController.findById);
router.put('/:id', productController.update);
router.delete('/:id', productController.remove);

module.exports = router;
