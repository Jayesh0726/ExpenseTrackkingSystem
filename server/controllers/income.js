import Transaction from "../models/transactionModel.js";
import Account from "../models/accountModel.js";
import { v4 as uuidv4 } from "uuid";
import { logAudit } from "../middleware/rbac.js";

// Create income (uses Transaction model)
async function handleCreateIncome(req, res){
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
            type: "income",
            amount,
            currency: "Rupees",
            category,
            account,
            vendor,
            description,
            tags: tags || [],
            date: date || new Date(),
        });

        const savedIncome = await transaction.save();

        // Update account balance
        await Account.findByIdAndUpdate(account, {
            $inc: { balance: amount },
        });

        // Log audit
        await logAudit(userId, "create", "transaction", transactionId, null, savedIncome);

        res.status(201).json({ 
            success: true, 
            message: "Income created successfully",
            data: savedIncome 
        });
    } catch (error) {
        console.error("Error adding income:", error.message);
        res.status(400).json({ success: false, message: error.message });
    }
}

// Get all income entries with pagination
async function handleGetIncome(req, res){
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
            type: "income",
            deletedAt: null 
        };

        if (category) filter.category = category;
        if (tags) filter.tags = { $in: tags.split(",") };
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) filter.date.$lte = new Date(endDate);
        }

        const incomes = await Transaction.find(filter)
            .populate("category", "name")
            .populate("account", "name")
            .populate("user", "username")
            .sort(sortBy)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Transaction.countDocuments(filter);

        res.status(200).json({ 
            success: true, 
            data: incomes,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit)),
            },
        });
    } catch (error) {
        console.error("Error fetching incomes:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

// Get single income
async function handleGetIncomeById(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        const income = await Transaction.findOne({
            transactionId: id,
            user: userId,
            type: "income",
        }).populate("category account user");

        if (!income) {
            return res.status(404).json({
                success: false,
                message: "Income not found",
            });
        }

        res.status(200).json({ success: true, data: income });
    } catch (error) {
        console.error("Error fetching income:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

// Update income
async function handleUpdateIncome(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;
        const updates = req.body;

        const income = await Transaction.findOne({
            transactionId: id,
            user: userId,
            type: "income",
        });

        if (!income) {
            return res.status(404).json({
                success: false,
                message: "Income not found",
            });
        }

        const before = { ...income.toObject() };

        Object.assign(income, updates);
        income.updatedAt = new Date();

        const updated = await income.save();

        // Log audit
        await logAudit(userId, "update", "transaction", id, before, updated);

        res.status(200).json({ 
            success: true, 
            message: "Income updated successfully",
            data: updated 
        });
    } catch (error) {
        console.error("Error updating income:", error.message);
        res.status(400).json({ success: false, message: error.message });
    }
}

// Delete income
async function handleDeleteIncome(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        const income = await Transaction.findOne({
            transactionId: id,
            user: userId,
            type: "income",
        });

        if (!income) {
            return res.status(404).json({
                success: false,
                message: "Income not found",
            });
        }

        income.deletedAt = new Date();
        await income.save();

        // Log audit
        await logAudit(userId, "delete", "transaction", id, income, null);

        res.status(200).json({ 
            success: true, 
            message: "Income deleted successfully" 
        });
    } catch (error) {
        console.error("Error deleting income:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

export {
    handleCreateIncome,
    handleGetIncome,
    handleGetIncomeById,
    handleUpdateIncome,
    handleDeleteIncome,
}