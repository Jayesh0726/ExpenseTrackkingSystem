import Transaction from "../models/transactionModel.js";
import Account from "../models/accountModel.js";
import Budget from "../models/budgetModel.js";
import { v4 as uuidv4 } from "uuid";
import { logAudit } from "../middleware/rbac.js";

// Create Transaction with validation
export const createTransaction = async (req, res) => {
    try {
        const userId = req.user.userId;
        const {
            type,
            amount,
            currency,
            category,
            account,
            fromAccount,
            toAccount,
            vendor,
            description,
            tags,
            date,
            recurring,
        } = req.body;

        // Validation
        if (!type || !amount || !category || !account || !description) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        }

        const transactionId = uuidv4();
        const transaction = new Transaction({
            transactionId,
            user: userId,
            type,
            amount,
            currency,
            category,
            account,
            fromAccount,
            toAccount,
            vendor,
            description,
            tags: tags || [],
            date: date || new Date(),
            recurring: recurring || { isRecurring: false },
        });

        const savedTransaction = await transaction.save();

        // Update budget spent amount
        if (type === "expense") {
            const budget = await Budget.findOne({
                user: userId,
                category: category,
                isActive: true,
            });

            if (budget) {
                budget.spent += amount;
                await budget.save();

                // Check alert threshold
                if (
                    !budget.alertSent &&
                    (budget.spent / budget.limit) * 100 >= budget.alertThreshold
                ) {
                    budget.alertSent = true;
                    await budget.save();
                    // TODO: Send email alert
                }
            }
        }

        // Update account balance
        if (type === "expense") {
            await Account.findByIdAndUpdate(account, {
                $inc: { balance: -amount },
            });
        } else if (type === "income") {
            await Account.findByIdAndUpdate(account, {
                $inc: { balance: amount },
            });
        }

        // Log audit
        await logAudit(userId, "create", "transaction", transactionId, null, savedTransaction);

        res.status(201).json({
            success: true,
            message: "Transaction created successfully",
            data: savedTransaction,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Get all transactions with pagination & filtering
export const getTransactions = async (req, res) => {
    try {
        const userId = req.user.userId;
        const {
            page = 1,
            limit = 20,
            type,
            category,
            startDate,
            endDate,
            tags,
            sortBy = "-date",
        } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Build filter
        const filter = { user: userId, deletedAt: null };
        if (type) filter.type = type;
        if (category) filter.category = category;
        if (tags) filter.tags = { $in: tags.split(",") };
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) filter.date.$lte = new Date(endDate);
        }

        const transactions = await Transaction.find(filter)
            .populate("category account")
            .sort(sortBy)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Transaction.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: transactions,
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

// Get single transaction
export const getTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const transaction = await Transaction.findOne({
            transactionId: id,
            user: userId,
        }).populate("category account splits.userId");

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });
        }

        res.status(200).json({
            success: true,
            data: transaction,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Update transaction
export const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        const updates = req.body;

        const transaction = await Transaction.findOne({
            transactionId: id,
            user: userId,
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });
        }

        const before = { ...transaction.toObject() };

        Object.assign(transaction, updates);
        transaction.updatedAt = new Date();

        const updated = await transaction.save();

        // Log audit
        await logAudit(userId, "update", "transaction", id, before, updated);

        res.status(200).json({
            success: true,
            message: "Transaction updated",
            data: updated,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Soft delete transaction
export const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const transaction = await Transaction.findOne({
            transactionId: id,
            user: userId,
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });
        }

        transaction.deletedAt = new Date();
        await transaction.save();

        // Log audit
        await logAudit(userId, "delete", "transaction", id, transaction, null);

        res.status(200).json({
            success: true,
            message: "Transaction deleted",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Approve transaction (for manager/admin)
export const approveTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const transaction = await Transaction.findOne({
            transactionId: id,
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });
        }

        transaction.status = "approved";
        transaction.approvedBy = userId;
        transaction.approvedAt = new Date();
        await transaction.save();

        // Log audit
        await logAudit(userId, "approve", "transaction", id, null, transaction);

        res.status(200).json({
            success: true,
            message: "Transaction approved",
            data: transaction,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
