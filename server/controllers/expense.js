import Transaction from "../models/transactionModel.js";
import Account from "../models/accountModel.js";
import Budget from "../models/budgetModel.js";
import { v4 as uuidv4 } from "uuid";
import { logAudit } from "../middleware/rbac.js";

// Create expense (uses Transaction model)
async function handleCreateExpense(req, res){
    try {
        const userId = req.user?.userId;
        const {
            amount,
            category,
            account,
            vendor,
            description,
            tags,
            date,
        } = req.body;

        if (!amount || !category || !account || !description) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        }

        const transactionId = uuidv4();
        const transaction = new Transaction({
            transactionId,
            user: userId,
            type: "expense",
            amount,
            currency: "Rupees",
            category,
            account,
            vendor,
            description,
            tags: tags || [],
            date: date || new Date(),
        });

        const savedExpense = await transaction.save();

        // Update budget spent amount
        const budget = await Budget.findOne({
            user: userId,
            category: category,
            isActive: true,
        });

        if (budget) {
            budget.spent += amount;
            await budget.save();

            if (
                !budget.alertSent &&
                (budget.spent / budget.limit) * 100 >= budget.alertThreshold
            ) {
                budget.alertSent = true;
                await budget.save();
                // TODO: Send email alert
            }
        }

        // Update account balance
        await Account.findByIdAndUpdate(account, {
            $inc: { balance: -amount },
        });

        // Log audit
        await logAudit(userId, "create", "transaction", transactionId, null, savedExpense);

        res.status(201).json({ 
            success: true, 
            message: "Expense created successfully",
            data: savedExpense 
        });
    } catch (error) {
        console.error("Error adding expense:", error.message);
        res.status(400).json({ success: false, message: error.message });
    }
}

// Get all expenses with pagination
async function handleGetExpense(req, res){
    try {
        const userId = req.user?.userId;
        const {
            page = 1,
            limit = 20,
            category,
            startDate,
            endDate,
            tags,
            sortBy = "-date",
        } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const filter = { 
            user: userId, 
            type: "expense",
            deletedAt: null 
        };

        if (category) filter.category = category;
        if (tags) filter.tags = { $in: tags.split(",") };
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) filter.date.$lte = new Date(endDate);
        }

        const expenses = await Transaction.find(filter)
            .populate("category", "name")
            .populate("account", "name")
            .populate("user", "username")
            .sort(sortBy)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Transaction.countDocuments(filter);

        res.status(200).json({ 
            success: true, 
            data: expenses,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit)),
            },
        });
    } catch (error) {
        console.error("Error fetching expenses:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

// Get single expense
async function handleGetExpenseById(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        const expense = await Transaction.findOne({
            transactionId: id,
            user: userId,
            type: "expense",
        }).populate("category account user");

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found",
            });
        }

        res.status(200).json({ success: true, data: expense });
    } catch (error) {
        console.error("Error fetching expense:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

// Update expense
async function handleUpdateExpense(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;
        const updates = req.body;

        const expense = await Transaction.findOne({
            transactionId: id,
            user: userId,
            type: "expense",
        });

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found",
            });
        }

        const before = { ...expense.toObject() };

        Object.assign(expense, updates);
        expense.updatedAt = new Date();

        const updated = await expense.save();

        // Log audit
        await logAudit(userId, "update", "transaction", id, before, updated);

        res.status(200).json({ 
            success: true, 
            message: "Expense updated successfully",
            data: updated 
        });
    } catch (error) {
        console.error("Error updating expense:", error.message);
        res.status(400).json({ success: false, message: error.message });
    }
}

// Delete expense
async function handleDeleteExpense(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        const expense = await Transaction.findOne({
            transactionId: id,
            user: userId,
            type: "expense",
        });

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found",
            });
        }

        expense.deletedAt = new Date();
        await expense.save();

        // Log audit
        await logAudit(userId, "delete", "transaction", id, expense, null);

        res.status(200).json({ 
            success: true, 
            message: "Expense deleted successfully" 
        });
    } catch (error) {
        console.error("Error deleting expense:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

export {
    handleCreateExpense,
    handleGetExpense,
    handleGetExpenseById,
    handleUpdateExpense,
    handleDeleteExpense,
}