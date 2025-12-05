import Account from "../models/accountModel.js";
import { v4 as uuidv4 } from "uuid";
import { logAudit } from "../middleware/rbac.js";

// Create Account
export const createAccount = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { name, type, currency, balance } = req.body;

        if (!name || !type) {
            return res.status(400).json({
                success: false,
                message: "Name and type are required",
            });
        }

        const account = new Account({
            name,
            type,
            currency: currency || "USD",
            balance: balance || 0,
            user: userId,
        });

        const saved = await account.save();

        // Log audit
        await logAudit(userId, "create", "account", saved._id.toString(), null, saved);

        res.status(201).json({
            success: true,
            message: "Account created",
            data: saved,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Get all accounts
export const getAccounts = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { page = 1, limit = 20, isActive } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const filter = { user: userId, deletedAt: null };

        if (isActive !== undefined) filter.isActive = isActive === "true";

        const accounts = await Account.find(filter)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Account.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: accounts,
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

// Get single account
export const getAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const account = await Account.findOne({
            _id: id,
            user: userId,
            deletedAt: null,
        });

        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Account not found",
            });
        }

        res.status(200).json({
            success: true,
            data: account,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Update account
export const updateAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        const updates = req.body;

        const account = await Account.findOne({
            _id: id,
            user: userId,
        });

        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Account not found",
            });
        }

        const before = { ...account.toObject() };

        Object.assign(account, updates);
        account.updatedAt = new Date();

        const updated = await account.save();

        // Log audit
        await logAudit(userId, "update", "account", id, before, updated);

        res.status(200).json({
            success: true,
            message: "Account updated",
            data: updated,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Delete account (soft delete)
export const deleteAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const account = await Account.findOne({
            _id: id,
            user: userId,
        });

        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Account not found",
            });
        }

        account.deletedAt = new Date();
        await account.save();

        // Log audit
        await logAudit(userId, "delete", "account", id, account, null);

        res.status(200).json({
            success: true,
            message: "Account deleted",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
