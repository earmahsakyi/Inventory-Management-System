const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');


router.post('/',auth, productController.createProduct);
router.get('/',auth, productController.getAllProducts);
router.get('/supplier/:supplierId',auth, productController.getProductsBySupplier);
router.get('/category/:categoryId', auth,productController.getProductsByCategory);
router.get('/:product_id',auth, productController.getProductById);
router.put('/:product_id',auth, productController.updateProduct);
router.delete('/:product_id',auth, productController.deleteProduct);

module.exports = router;