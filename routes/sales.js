const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');
const auth = require('../middleware/auth');

router.post('/',auth, saleController.createSale);
router.get('/',auth, saleController.getAllSales);
router.get('/:sale_id',auth, saleController.getSaleById);

module.exports = router;