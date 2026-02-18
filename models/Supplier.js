const pool = require('../config/mysql');

//create supplier
exports.createSupplier = async (data) => {
    const {name, email, phone, address} = data;
    const [results] = await pool.query(
        "INSERT INTO suppliers(name,email,phone,address) VALUES(?,?,?,?)",
        [name,email,phone,address]

    )
    return results
};

// read all
exports.getAllSuppliers = async (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    const [results] = await pool.query(
        "SELECT * FROM suppliers ORDER BY name ASC LIMIT ? OFFSET ?",
        [parseInt(limit), parseInt(offset)]
    );
    return results;
};

// read one
exports.getSupplierById = async (id) => {
    const [results] = await pool.query(
        "SELECT * FROM suppliers WHERE supplier_id = ?",
        [id]
    )
    return results[0];
};

// update
exports.updateSupplier = async (id, data) => {
    const { name, email, phone, address } = data;

    const [results] = await pool.query(
        `UPDATE suppliers 
         SET 
            name = ?, 
            email = ?, 
            phone = ?, 
            address = ?
         WHERE supplier_id = ?`,
        [name, email, phone, address, id]
    );

    return results;
};

// delete
exports.deleteSupplier = async (id) => {
    const [results] = await pool.query(
        "DELETE FROM suppliers WHERE supplier_id = ?",
        [id]
    );

    return results
};

// get supplier by email
exports.getSupplierByEmail = async (email) => {
    const [results] = await pool.query(
        "SELECT * FROM suppliers WHERE email = ?",
        [email]
    );
    return results[0]; 
};