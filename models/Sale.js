const pool = require('../config/mysql');

// Create a sale with its items inside a transaction.
// Stock validation and deduction are handled by MySQL triggers:
//   - before_sale_insert  → validates stock, signals error if insufficient
//   - after_sale_insert   → deducts stock_quantity automatically
exports.createSaleWithItems = async (saleData, items) => {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        // 1. Insert the sale record (total_amount starts at 0, updated at the end)
        const { created_by } = saleData;
        const [saleResult] = await conn.query(
            "INSERT INTO sales(created_by) VALUES(?)",
            [created_by || null]
        );
        const sale_id = saleResult.insertId;

        let total_amount = 0;

        // 2. Insert each sale item.
        //    The before_sale_insert trigger will SIGNAL '45000' if stock is insufficient,
        //    which throws an error caught below and triggers a rollback.
        //    The after_sale_insert trigger will deduct stock automatically.
        for (const item of items) {
            const { product_id, quantity } = item;

            // Fetch current price from products table
            const [productRows] = await conn.query(
                "SELECT product_id, name, price FROM products WHERE product_id = ?",
                [product_id]
            );

            if (productRows.length === 0) {
                await conn.rollback();
                conn.release();
                return { error: `Product with ID ${product_id} not found`, status: 404 };
            }

            const product = productRows[0];
            const itemPrice = parseFloat(product.price);
            const itemTotal = itemPrice * quantity;
            total_amount += itemTotal;

            // This INSERT will trigger before_sale_insert (stock check) and
            // after_sale_insert (stock deduction) automatically
            await conn.query(
                "INSERT INTO sale_items(sale_id, product_id, quantity, price, total) VALUES(?, ?, ?, ?, ?)",
                [sale_id, product_id, quantity, itemPrice, itemTotal]
            );
        }

        // 3. Update the sale's total_amount
        await conn.query(
            "UPDATE sales SET total_amount = ? WHERE sale_id = ?",
            [total_amount, sale_id]
        );

        await conn.commit();
        conn.release();

        return { sale_id, total_amount };

    } catch (err) {
        await conn.rollback();
        conn.release();

        // MySQL trigger SIGNAL produces sqlState '45000'
        // Surface it as a clean business error instead of a generic 500
        if (err.sqlState === '45000') {
            return { error: err.message, status: 409 };
        }

        throw err;
    }
};

// read all sales
exports.getAllSales = async (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    const [results] = await pool.query(
        "SELECT * FROM sales ORDER BY sale_date DESC LIMIT ? OFFSET ?",
        [parseInt(limit), parseInt(offset)]
    );
    return results;
};

// read one sale with its items
exports.getSaleById = async (id) => {
    const [saleRows] = await pool.query(
        "SELECT * FROM sales WHERE sale_id = ?",
        [id]
    );
    if (!saleRows[0]) return null;

    const [itemRows] = await pool.query(
        `SELECT si.*, p.name AS product_name
         FROM sale_items si
         JOIN products p ON si.product_id = p.product_id
         WHERE si.sale_id = ?`,
        [id]
    );

    return { ...saleRows[0], items: itemRows };
};