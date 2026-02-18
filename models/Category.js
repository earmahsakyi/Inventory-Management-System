const pool = require('../config/mysql');

// create category
exports.createCategory = async (data) => {
    const { name, description } = data;
    const [results] = await pool.query(
        "INSERT INTO categories(name, description) VALUES(?, ?)",
        [name, description]
    );
    return results;
};

// read all
exports.getAllCategories = async (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    const [results] = await pool.query(
        "SELECT * FROM categories ORDER BY name ASC LIMIT ? OFFSET ?",
        [parseInt(limit), parseInt(offset)]
    );
    return results;
};

// read one
exports.getCategoryById = async (id) => {
    const [results] = await pool.query(
        "SELECT * FROM categories WHERE category_id = ?",
        [id]
    );
    return results[0];
};

// update
exports.updateCategory = async (id, data) => {
    const { name, description } = data;
    const [results] = await pool.query(
        `UPDATE categories SET name = ?, description = ? WHERE category_id = ?`,
        [name, description, id]
    );
    return results;
};

// delete
exports.deleteCategory = async (id) => {
    const [results] = await pool.query(
        "DELETE FROM categories WHERE category_id = ?",
        [id]
    );
    return results;
};

// get category by name (unique check)
exports.getCategoryByName = async (name) => {
    const [results] = await pool.query(
        "SELECT * FROM categories WHERE name = ?",
        [name]
    );
    return results[0];
};