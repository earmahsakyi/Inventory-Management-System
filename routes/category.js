const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const auth = require('../middleware/auth');

router.post('/',auth, categoryController.createCategory);
router.get('/',auth, categoryController.getAllCategories);
router.get('/:category_id',auth, categoryController.getCategoryById);
router.put('/:category_id',auth, categoryController.updateCategory);
router.delete('/:category_id',auth, categoryController.deleteCategory);

module.exports = router; 