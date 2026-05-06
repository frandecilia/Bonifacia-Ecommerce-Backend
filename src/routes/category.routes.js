const express = require('express');
const categoryController = require('../controllers/category.controllers');

const router = express.Router();

router.post('/', categoryController.create);
router.get('/', categoryController.findAll);
router.get('/:id', categoryController.findById);
router.put('/:id', categoryController.update);
router.delete('/:id', categoryController.remove);

module.exports = router;
