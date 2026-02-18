const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const auth = require('../middleware/auth');

router.get('/sales-by-product',auth, reportController.getSalesByProduct);
router.get('/sales-by-date',auth, reportController.getSalesByDate);

module.exports = router;