const Product = require('../models/Product');
const Supplier = require('../models/Supplier');
const Category = require('../models/Category');

exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, stock_quantity, supplier_id, category_id } = req.body;

        if (!name || price === undefined || !supplier_id || !category_id) {
            return res.status(400).json({
                success: false, 
                message: 'Name, price, supplier_id, and category_id are required!'
            });
        }

        if (isNaN(price) || price < 0) {
            return res.status(400).json({ success: false, message: 'Price must be a non-negative number' });
        }

        const stockQty = stock_quantity !== undefined ? parseInt(stock_quantity) : 0;
        if (isNaN(stockQty) || stockQty < 0) {
            return res.status(400).json({ success: false, message: 'Stock quantity must be a non-negative integer' });
        }

        if (isNaN(supplier_id)) {
            return res.status(400).json({ success: false, message: 'Valid supplier_id is required' });
        }
        if (isNaN(category_id)) {
            return res.status(400).json({ success: false, message: 'Valid category_id is required' });
        }

        // Check foreign keys exist
        const supplier = await Supplier.getSupplierById(supplier_id);
        if (!supplier) {
            return res.status(404).json({ success: false, message: 'Supplier not found' });
        }

        const category = await Category.getCategoryById(category_id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        // Check unique constraint
        const existing = await Product.getProductByNameAndSupplier(name.trim(), supplier_id);
        if (existing) {
            return res.status(409).json({
                success: false,
                message: 'A product with this name already exists for this supplier'
            });
        }

        const newProduct = {
            name: name.trim(),
            description: description?.trim() || null,
            price: parseFloat(price),
            stock_quantity: stockQty,
            supplier_id: parseInt(supplier_id),
            category_id: parseInt(category_id)
        };

        const result = await Product.createProduct(newProduct);

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: result
        });

    } catch (err) {
        console.error('Failed to create product', err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const products = await Product.getAllProducts(page, limit);
        res.status(200).json({ success: true, page, limit, data: products });

    } catch (err) {
        console.error('Failed to fetch products', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const { product_id } = req.params;

        if (!product_id || isNaN(product_id)) {
            return res.status(400).json({ success: false, message: 'Valid product ID is required!' });
        }

        const product = await Product.getProductById(product_id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.status(200).json({ success: true, data: product });

    } catch (err) {
        console.error('Failed to fetch product', err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { product_id } = req.params;
        const { name, description, price, stock_quantity, supplier_id, category_id } = req.body;

        if (!product_id || isNaN(product_id)) {
            return res.status(400).json({ success: false, message: 'Valid product ID is required' });
        }

        if (!name && price === undefined && stock_quantity === undefined && !supplier_id && !category_id) {
            return res.status(400).json({
                success: false,
                message: 'At least one field is required to update'
            });
        }

        const product = await Product.getProductById(product_id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Build update object using existing values as defaults
        const updateData = {
            name: name ? name.trim() : product.name,
            description: description !== undefined ? description?.trim() : product.description,
            price: price !== undefined ? parseFloat(price) : product.price,
            stock_quantity: stock_quantity !== undefined ? parseInt(stock_quantity) : product.stock_quantity,
            supplier_id: supplier_id ? parseInt(supplier_id) : product.supplier_id,
            category_id: category_id ? parseInt(category_id) : product.category_id
        };

        if (isNaN(updateData.price) || updateData.price < 0) {
            return res.status(400).json({ success: false, message: 'Price must be a non-negative number' });
        }
        if (isNaN(updateData.stock_quantity) || updateData.stock_quantity < 0) {
            return res.status(400).json({ success: false, message: 'Stock quantity must be a non-negative integer' });
        }

        // Validate foreign keys if changed
        if (supplier_id) {
            const supplier = await Supplier.getSupplierById(updateData.supplier_id);
            if (!supplier) return res.status(404).json({ success: false, message: 'Supplier not found' });
        }

        if (category_id) {
            const category = await Category.getCategoryById(updateData.category_id);
            if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
        }

        // Check unique constraint if name or supplier changed
        if (name || supplier_id) {
            const existing = await Product.getProductByNameAndSupplier(updateData.name, updateData.supplier_id);
            if (existing && existing.product_id != product_id) {
                return res.status(409).json({
                    success: false,
                    message: 'A product with this name already exists for this supplier'
                });
            }
        }

        const results = await Product.updateProduct(product_id, updateData);

        res.status(200).json({ success: true, message: 'Product updated successfully', data: results });

    } catch (err) {
        console.error('Failed to update product', err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { product_id } = req.params;

        if (!product_id || isNaN(product_id)) {
            return res.status(400).json({ success: false, message: 'Valid product ID is required!' });
        }

        const product = await Product.getProductById(product_id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        await Product.deleteProduct(product_id);

        res.status(200).json({ success: true, message: 'Product deleted successfully', id: product_id });

    } catch (err) {
        console.error('Failed to delete product', err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

exports.getProductsBySupplier = async (req, res) => {
    try {
        const { supplierId } = req.params;

        if (!supplierId || isNaN(supplierId)) {
            return res.status(400).json({ success: false, message: 'Valid supplier ID is required!' });
        }

        const supplier = await Supplier.getSupplierById(supplierId);
        if (!supplier) {
            return res.status(404).json({ success: false, message: 'Supplier not found' });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const products = await Product.getProductsBySupplier(supplierId, page, limit);
        res.status(200).json({ success: true, page, limit, data: products });

    } catch (err) {
        console.error('Failed to fetch products by supplier', err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

exports.getProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        if (!categoryId || isNaN(categoryId)) {
            return res.status(400).json({ success: false, message: 'Valid category ID is required!' });
        }

        const category = await Category.getCategoryById(categoryId);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const products = await Product.getProductsByCategory(categoryId, page, limit);
        res.status(200).json({ success: true, page, limit, data: products });

    } catch (err) {
        console.error('Failed to fetch products by category', err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};