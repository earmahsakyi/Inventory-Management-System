const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');

router.post('/',auth, supplierController.createSupplier);
router.get('/',auth, supplierController.getAllSuppliers);
router.get('/:supplier_id/products',auth, productController.getProductsBySupplier);
router.get('/:supplier_id',auth, supplierController.getSupplierById);
router.put('/:supplier_id',auth, supplierController.updateSupplier);
router.delete('/:supplier_id',auth, supplierController.deleteSupplier);

module.exports = router;