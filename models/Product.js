const pool = require('../config/mysql');

// create product
exports.createProduct = async (data) => {
    const { name, description, price, stock_quantity, supplier_id, category_id } = data;
    const [results] = await pool.query(
        `INSERT INTO products(name, description, price, stock_quantity, supplier_id, category_id)
         VALUES(?, ?, ?, ?, ?, ?)`,
        [name, description, price, stock_quantity, supplier_id, category_id]
    );
    return results;
};

// read all
exports.getAllProducts = async (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    const [results] = await pool.query(
        `SELECT p.*, s.name AS supplier_name, c.name AS category_name
         FROM products p
         JOIN suppliers s ON p.supplier_id = s.supplier_id
         JOIN categories c ON p.category_id = c.category_id
         ORDER BY p.name ASC LIMIT ? OFFSET ?`,
        [parseInt(limit), parseInt(offset)]
    );
    return results;
};

// read one
exports.getProductById = async (id) => {
    const [results] = await pool.query(
        `SELECT p.*, s.name AS supplier_name, c.name AS category_name
         FROM products p
         JOIN suppliers s ON p.supplier_id = s.supplier_id
         JOIN categories c ON p.category_id = c.category_id
         WHERE p.product_id = ?`,
        [id]
    );
    return results[0];
};

// update
exports.updateProduct = async (id, data) => {
    const { name, description, price, stock_quantity, supplier_id, category_id } = data;
    const [results] = await pool.query(
        `UPDATE products
         SET name = ?, description = ?, price = ?, stock_quantity = ?, supplier_id = ?, category_id = ?
         WHERE product_id = ?`,
        [name, description, price, stock_quantity, supplier_id, category_id, id]
    );
    return results;
};

// delete
exports.deleteProduct = async (id) => {
    const [results] = await pool.query(
        "DELETE FROM products WHERE product_id = ?",
        [id]
    );
    return results;
};

// check unique constraint (name + supplier)
exports.getProductByNameAndSupplier = async (name, supplier_id) => {
    const [results] = await pool.query(
        "SELECT * FROM products WHERE name = ? AND supplier_id = ?",
        [name, supplier_id]
    );
    return results[0];
};

// get products by supplier
exports.getProductsBySupplier = async (supplier_id, page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    const [results] = await pool.query(
        `SELECT p.*, c.name AS category_name
         FROM products p
         JOIN categories c ON p.category_id = c.category_id
         WHERE p.supplier_id = ?
         ORDER BY p.name ASC LIMIT ? OFFSET ?`,
        [supplier_id, parseInt(limit), parseInt(offset)]
    );
    return results;
};

// get products by category
exports.getProductsByCategory = async (category_id, page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    const [results] = await pool.query(
        `SELECT p.*, s.name AS supplier_name
         FROM products p
         JOIN suppliers s ON p.supplier_id = s.supplier_id
         WHERE p.category_id = ?
         ORDER BY p.name ASC LIMIT ? OFFSET ?`,
        [category_id, parseInt(limit), parseInt(offset)]
    );
    return results;
};

// decrease stock quantity (used in sales)
exports.decreaseStock = async (conn, product_id, quantity) => {
    const [results] = await conn.query(
        "UPDATE products SET stock_quantity = stock_quantity - ? WHERE product_id = ?",
        [quantity, product_id]
    );
    return results;
};