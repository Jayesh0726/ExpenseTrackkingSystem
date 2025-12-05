import Category from "../models/categoryModel.js";
import { logAudit } from "../middleware/rbac.js";

// Create category
async function handleCreatingCategory(req, res){
    try {
        const userId = req.user?.userId;
        const { name, type } = req.body;

        if (!name || !type) {
            return res.status(400).json({
                success: false,
                message: "Name and type are required",
            });
        }

        if (!["Income", "Expense"].includes(type)) {
            return res.status(400).json({
                success: false,
                message: "Type must be 'Income' or 'Expense'",
            });
        }

        // Check if category already exists for this user
        const existing = await Category.findOne({ 
            name: name.toLowerCase(), 
            type,
            createdBy: userId 
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Category already exists",
            });
        }

        const newCategory = new Category({
            name,
            type,
            createdBy: userId,
        });

        const savedCategory = await newCategory.save();
        
        // Log audit
        await logAudit(userId, "create", "category", savedCategory._id.toString(), null, savedCategory);

        res.status(201).json({ 
            success: true, 
            message: "Category created successfully",
            data: savedCategory 
        });
    } catch (error) {
        console.error("Error creating category:", error.message);
        res.status(400).json({ success: false, message: error.message });
    }
}

// Get all categories for user
async function handleGettingCategory(req, res){
    try {
        const userId = req.user?.userId;
        const { type, page = 1, limit = 20 } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const filter = { createdBy: userId };

        if (type && ["Income", "Expense"].includes(type)) {
            filter.type = type;
        }

        const categories = await Category.find(filter)
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ name: 1 });

        const total = await Category.countDocuments(filter);

        res.status(200).json({ 
            success: true, 
            data: categories,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit)),
            },
        });
    } catch (error) {
        console.error("Error fetching categories:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

// Get single category
async function handleGetCategory(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        const category = await Category.findOne({
            _id: id,
            createdBy: userId,
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        res.status(200).json({ success: true, data: category });
    } catch (error) {
        console.error("Error fetching category:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

// Update category
async function handleUpdateCategory(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;
        const { name, type } = req.body;

        const category = await Category.findOne({
            _id: id,
            createdBy: userId,
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        const before = { ...category.toObject() };

        if (name) category.name = name;
        if (type && ["Income", "Expense"].includes(type)) category.type = type;

        const updated = await category.save();

        // Log audit
        await logAudit(userId, "update", "category", id, before, updated);

        res.status(200).json({ 
            success: true, 
            message: "Category updated successfully",
            data: updated 
        });
    } catch (error) {
        console.error("Error updating category:", error.message);
        res.status(400).json({ success: false, message: error.message });
    }
}

// Delete category
async function handleDeleteCategory(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        const category = await Category.findOne({
            _id: id,
            createdBy: userId,
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        await Category.deleteOne({ _id: id });

        // Log audit
        await logAudit(userId, "delete", "category", id, category, null);

        res.status(200).json({ 
            success: true, 
            message: "Category deleted successfully" 
        });
    } catch (error) {
        console.error("Error deleting category:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

export {
    handleCreatingCategory,
    handleGettingCategory,
    handleGetCategory,
    handleUpdateCategory,
    handleDeleteCategory,
}