const Sale = require('../models/Sale');

exports.createSale = async (req, res) => {
    try {
        const { created_by, items } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'At least one item is required to record a sale'
            });
        }

        // Validate each item
        for (const item of items) {
            if (!item.product_id || isNaN(item.product_id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Each item must have a valid product_id'
                });
            }
            if (!item.quantity || isNaN(item.quantity) || parseInt(item.quantity) <= 0) {
                return res.status(400).json({
                    success: false,
                    message: `Item with product_id ${item.product_id} must have a quantity greater than 0`
                });
            }
        }

        const saleData = { created_by: created_by || null };
        const parsedItems = items.map(i => ({
            product_id: parseInt(i.product_id),
            quantity: parseInt(i.quantity)
        }));

        const result = await Sale.createSaleWithItems(saleData, parsedItems);

        // Handle business logic errors returned from model (stock issues, not found, etc.)
        if (result.error) {
            return res.status(result.status).json({ success: false, message: result.error });
        }

        res.status(201).json({
            success: true,
            message: 'Sale recorded successfully',
            data: result
        });

    } catch (err) {
        console.error('Failed to create sale', err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

exports.getAllSales = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const sales = await Sale.getAllSales(page, limit);
        res.status(200).json({ success: true, page, limit, data: sales });

    } catch (err) {
        console.error('Failed to fetch sales', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getSaleById = async (req, res) => {
    try {
        const { sale_id } = req.params;

        if (!sale_id || isNaN(sale_id)) {
            return res.status(400).json({ success: false, message: 'Valid sale ID is required!' });
        }

        const sale = await Sale.getSaleById(sale_id);
        if (!sale) {
            return res.status(404).json({ success: false, message: 'Sale not found' });
        }

        res.status(200).json({ success: true, data: sale });

    } catch (err) {
        console.error('Failed to fetch sale', err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};