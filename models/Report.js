const pool = require('../config/mysql');

// Total sales per product
exports.getSalesByProduct = async () => {
    const [results] = await pool.query(
        `SELECT 
            p.product_id,
            p.name AS product_name,
            SUM(si.quantity) AS total_units_sold,
            SUM(si.total) AS total_sales
         FROM sale_items si
         JOIN products p ON si.product_id = p.product_id
         GROUP BY p.product_id, p.name
         ORDER BY total_sales DESC`
    );
    return results;
};

// Total sales per day
exports.getSalesByDate = async () => {
    const [results] = await pool.query(
        `SELECT 
            DATE(s.sale_date) AS sale_date,
            COUNT(s.sale_id) AS total_transactions,
            SUM(s.total_amount) AS total_revenue
         FROM sales s
         GROUP BY DATE(s.sale_date)
         ORDER BY sale_date DESC`
    );
    return results;
};