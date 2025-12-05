import Budget from "../models/budgetModel.js";
import { v4 as uuidv4 } from "uuid";
import { logAudit } from "../middleware/rbac.js";

// Create budget
export const createBudget = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { category, period, limit, startDate, endDate, alertThreshold } = req.body;

        if (!category || !period || !limit || !startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        }

        if (!["daily", "weekly", "monthly", "quarterly", "yearly"].includes(period)) {
            return res.status(400).json({
                success: false,
                message: "Invalid period",
            });
        }

        // Check if budget already exists for this period
        const existing = await Budget.findOne({
            user: userId,
            category,
            startDate: { $lte: new Date(endDate) },
            endDate: { $gte: new Date(startDate) },
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Budget already exists for this period",
            });
        }

        const budgetId = uuidv4();
        const budget = new Budget({
            budgetId,
            user: userId,
            category,
            period,
            limit,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            alertThreshold: alertThreshold || 80,
        });

        const saved = await budget.save();

        // Log audit
        await logAudit(userId, "create", "budget", budgetId, null, saved);

        res.status(201).json({
            success: true,
            message: "Budget created successfully",
            data: saved,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Get all budgets
export const getBudgets = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { page = 1, limit = 20, isActive } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const filter = { user: userId };

        if (isActive !== undefined) {
            filter.isActive = isActive === "true";
        }

        const budgets = await Budget.find(filter)
            .populate("category", "name")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Budget.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: budgets,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit)),
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get single budget
export const getBudget = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const budget = await Budget.findOne({
            budgetId: id,
            user: userId,
        }).populate("category");

        if (!budget) {
            return res.status(404).json({
                success: false,
                message: "Budget not found",
            });
        }

        // Calculate remaining amount
        const remaining = budget.limit - budget.spent;
        const percentageUsed = ((budget.spent / budget.limit) * 100).toFixed(2);

        res.status(200).json({
            success: true,
            data: {
                ...budget.toObject(),
                remaining,
                percentageUsed,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Update budget
export const updateBudget = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        const updates = req.body;

        const budget = await Budget.findOne({
            budgetId: id,
            user: userId,
        });

        if (!budget) {
            return res.status(404).json({
                success: false,
                message: "Budget not found",
            });
        }

        const before = { ...budget.toObject() };

        // Only allow certain fields to be updated
        if (updates.limit) budget.limit = updates.limit;
        if (updates.alertThreshold !== undefined) budget.alertThreshold = updates.alertThreshold;
        if (updates.isActive !== undefined) budget.isActive = updates.isActive;
        if (updates.endDate) budget.endDate = new Date(updates.endDate);

        budget.updatedAt = new Date();
        const updated = await budget.save();

        // Log audit
        await logAudit(userId, "update", "budget", id, before, updated);

        res.status(200).json({
            success: true,
            message: "Budget updated successfully",
            data: updated,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Delete budget
export const deleteBudget = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const budget = await Budget.findOne({
            budgetId: id,
            user: userId,
        });

        if (!budget) {
            return res.status(404).json({
                success: false,
                message: "Budget not found",
            });
        }

        await Budget.deleteOne({ budgetId: id });

        // Log audit
        await logAudit(userId, "delete", "budget", id, budget, null);

        res.status(200).json({
            success: true,
            message: "Budget deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get budget status for category
export const getBudgetStatus = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { categoryId } = req.params;

        const budget = await Budget.findOne({
            user: userId,
            category: categoryId,
            isActive: true,
        }).populate("category");

        if (!budget) {
            return res.status(404).json({
                success: false,
                message: "No active budget for this category",
            });
        }

        const remaining = budget.limit - budget.spent;
        const percentageUsed = ((budget.spent / budget.limit) * 100).toFixed(2);
        const isAlertActive =
            !budget.alertSent &&
            percentageUsed >= budget.alertThreshold;

        res.status(200).json({
            success: true,
            data: {
                category: budget.category.name,
                limit: budget.limit,
                spent: budget.spent,
                remaining,
                percentageUsed,
                alertThreshold: budget.alertThreshold,
                isAlertActive,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Reset budget spent amount (for new period)
export const resetBudgetSpent = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const budget = await Budget.findOne({
            budgetId: id,
            user: userId,
        });

        if (!budget) {
            return res.status(404).json({
                success: false,
                message: "Budget not found",
            });
        }

        const before = { ...budget.toObject() };

        budget.spent = 0;
        budget.alertSent = false;
        budget.updatedAt = new Date();

        const updated = await budget.save();

        // Log audit
        await logAudit(userId, "update", "budget", id, before, updated);

        res.status(200).json({
            success: true,
            message: "Budget reset successfully",
            data: updated,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
