const Report = require('../models/Report');

exports.getSalesByProduct = async (req, res) => {
    try {
        const data = await Report.getSalesByProduct();
        res.status(200).json({ success: true, data });
    } catch (err) {
        console.error('Failed to fetch sales by product', err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

exports.getSalesByDate = async (req, res) => {
    try {
        const data = await Report.getSalesByDate();
        res.status(200).json({ success: true, data });
    } catch (err) {
        console.error('Failed to fetch sales by date', err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};