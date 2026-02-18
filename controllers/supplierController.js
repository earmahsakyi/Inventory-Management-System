const Supplier = require('../models/Supplier');

exports.createSupplier = async (req, res) => {
    try {
        const {name, email, phone, address} = req.body;

        if (!email || !name || !phone){
            return res.status(400).json("Name, email and phone are required!")
        };

        const cleanedName = name.trim();
        const cleanedPhone = phone.trim();
        const cleanedAddress = address?.trim();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if(!emailRegex.test(email)){
            return res.status(400).json("Invalid email format!")
        };

        const existingUser = await Supplier.getSupplierByEmail(email);
        if(existingUser){
            return res.status(409).json("Supplier with this email already exists")
        };

        //build new supplier object 
        const newSupplier = {
            name: cleanedName,
            email,
            phone: cleanedPhone,
            address: cleanedAddress
        };
        const result = await Supplier.createSupplier(newSupplier);

        res.status(201).json({
            success: true,
            message: "Supplier created successfully",
            data: result
        });




    }catch ( err){
        console.error('Failed to create supplier',err);
        res.status(500).json({
            success: false,
            message: 'server error',
            error: err.message
        })

    }
};


exports.getAllSuppliers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const suppliers = await Supplier.getAllSuppliers(page, limit);
        res.status(200).json({
            success: true,
            page,
            limit,
            data: suppliers
        });
    } catch (err) {
        console.error('Failed to fetch suppliers',err);
        res.status(500).json({ success: false, message: err.message });
    }
};


exports.getSupplierById = async (req, res) => {
    try {
        const {supplier_id} = req.params;

    if(!supplier_id || isNaN(supplier_id)){
        return res.status(400).json("supplier id is required!");


    };

    const supplier = await Supplier.getSupplierById(supplier_id);

    if(!supplier){
        return res.status(404).json("Supplier not found");
    };

    res.status(200).json({
        success: true,
        data: supplier
    })

    }catch (err){
        console.error("Failed to fetch supplier");
        res.status(500).json({
            success: false,
            message:'Server error',
            error: err.message
        })
    }

};


exports.updateSupplier = async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;
        const { supplier_id } = req.params;

        // Validate supplier_id
        if (!supplier_id || isNaN(supplier_id)) {
            return res.status(400).json({
                success: false,
                message: "Valid supplier id is required"
            });
        }

        // Ensure at least one field is provided
        if (!name && !email && !phone && !address) {
            return res.status(400).json({
                success: false,
                message: "At least one field (name, email, phone, address) is required"
            });
        }

        // Check if supplier exists
        const supplier = await Supplier.getSupplierById(supplier_id);
        if (!supplier) {
            return res.status(404).json({
                success: false,
                message: "Supplier not found"
            });
        }

        const updateSup = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        //  Email validation + duplicate check
        if (email !== undefined) {

            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid email format"
                });
            }

            // Check if email already exists for another supplier
            const existing = await Supplier.getSupplierByEmail(email);

            if (existing && existing.supplier_id != supplier_id) {
                return res.status(409).json({
                    success: false,
                    message: "Email already in use"
                });
            }

            updateSup.email = email;
        }

        if (name) {
            updateSup.name = name.trim();
        }

        if (phone) {
            updateSup.phone = phone.trim();
        }

        if (address) {
            updateSup.address = address.trim();
        }

        const results = await Supplier.updateSupplier(supplier_id, updateSup);

        res.status(200).json({
            success: true,
            message: "Supplier updated successfully",
            data: results
        });

    } catch (err) {
        console.error('Failed to update supplier', err);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: err.message
        });
    }
};



exports.deleteSupplier = async (req,res) => {
    try {
    const {supplier_id} = req.params;

    if(!supplier_id || isNaN(supplier_id)){
        return res.status(400).json("Supplier id is required!");
    }

    const supplier = await Supplier.getSupplierById(supplier_id);

    if(!supplier){
        return res.status(404).json('Supplier not found!')
    };

    await Supplier.deleteSupplier(supplier_id);

    res.status(200).json({
        success: true,
        message: 'Supplier deleted successfully!',
        id: supplier_id
    })
    

     }catch(err){
        console.error('Failed to delete supplier',err);
        res.status(500).json({
            success: false,
            messgae: 'Server error!',
            error: err.message
        })

     }
}
