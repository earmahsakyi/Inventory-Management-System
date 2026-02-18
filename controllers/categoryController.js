const Category = require('../models/Category');

exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: 'Category name is required!' });
        }

        const cleanedName = name.trim();

        const existing = await Category.getCategoryByName(cleanedName);
        if (existing) {
            return res.status(409).json({ success: false, message: 'Category with this name already exists' });
        }

        const newCategory = { name: cleanedName, description: description?.trim() || null };
        const result = await Category.createCategory(newCategory);

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: result
        });

    } catch (err) {
        console.error('Failed to create category', err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const categories = await Category.getAllCategories(page, limit);
        res.status(200).json({ success: true, page, limit, data: categories });

    } catch (err) {
        console.error('Failed to fetch categories', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const { category_id } = req.params;

        if (!category_id || isNaN(category_id)) {
            return res.status(400).json({ success: false, message: 'Valid category ID is required!' });
        }

        const category = await Category.getCategoryById(category_id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        res.status(200).json({ success: true, data: category });

    } catch (err) {
        console.error('Failed to fetch category', err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { category_id } = req.params;
        const { name, description } = req.body;

        if (!category_id || isNaN(category_id)) {
            return res.status(400).json({ success: false, message: 'Valid category ID is required' });
        }

        if (!name && !description) {
            return res.status(400).json({ success: false, message: 'At least one field (name, description) is required' });
        }

        const category = await Category.getCategoryById(category_id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        const updateData = {
            name: name ? name.trim() : category.name,
            description: description !== undefined ? description?.trim() : category.description
        };

        // Check for duplicate name if name is being changed
        if (name && name.trim() !== category.name) {
            const existing = await Category.getCategoryByName(name.trim());
            if (existing && existing.category_id != category_id) {
                return res.status(409).json({ success: false, message: 'Category name already in use' });
            }
        }

        const results = await Category.updateCategory(category_id, updateData);

        res.status(200).json({ success: true, message: 'Category updated successfully', data: results });

    } catch (err) {
        console.error('Failed to update category', err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { category_id } = req.params;

        if (!category_id || isNaN(category_id)) {
            return res.status(400).json({ success: false, message: 'Valid category ID is required!' });
        }

        const category = await Category.getCategoryById(category_id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        await Category.deleteCategory(category_id);

        res.status(200).json({ success: true, message: 'Category deleted successfully', id: category_id });

    } catch (err) {
        console.error('Failed to delete category', err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};