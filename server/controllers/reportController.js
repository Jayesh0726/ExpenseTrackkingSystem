import User from "../models/userModel.js";
import Transaction from "../models/transactionModel.js";
import Budget from "../models/budgetModel.js";
import { v4 as uuidv4 } from "uuid";

// Get Dashboard Analytics
export const getDashboard = async (req, res) => {
    try {
        const userId = req.user.userId;
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        // Total Income & Expense this month
        const transactions = await Transaction.find({
            user: userId,
            date: { $gte: monthStart, $lte: monthEnd },
        });

        const totalIncome = transactions
            .filter((t) => t.type === "income")
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpense = transactions
            .filter((t) => t.type === "expense")
            .reduce((sum, t) => sum + t.amount, 0);

        // Budget status
        const budgets = await Budget.find({
            user: userId,
            isActive: true,
        }).populate("category");

        // Recent transactions
        const recentTransactions = await Transaction.find({ user: userId })
            .sort({ date: -1 })
            .limit(10)
            .populate("category account");

        // Top spending categories
        const topCategories = await Transaction.aggregate([
            { $match: { user: userId, type: "expense", date: { $gte: monthStart } } },
            { $group: { _id: "$category", total: { $sum: "$amount" } } },
            { $sort: { total: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "categories",
                    localField: "_id",
                    foreignField: "_id",
                    as: "categoryInfo",
                },
            },
        ]);

        res.status(200).json({
            success: true,
            data: {
                monthlyStats: {
                    totalIncome,
                    totalExpense,
                    netCashflow: totalIncome - totalExpense,
                },
                budgetStatus: budgets.map((b) => ({
                    category: b.category.name,
                    limit: b.limit,
                    spent: b.spent,
                    remaining: b.limit - b.spent,
                    percentageUsed: ((b.spent / b.limit) * 100).toFixed(2),
                })),
                recentTransactions,
                topCategories,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get Financial Reports
export const getFinancialReport = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { startDate, endDate, groupBy = "month" } = req.query;

        const start = new Date(startDate);
        const end = new Date(endDate);

        const transactions = await Transaction.find({
            user: userId,
            date: { $gte: start, $lte: end },
        }).populate("category");

        // Group by category
        const byCategory = {};
        transactions.forEach((t) => {
            const catName = t.category.name;
            if (!byCategory[catName]) {
                byCategory[catName] = { income: 0, expense: 0 };
            }
            if (t.type === "income") byCategory[catName].income += t.amount;
            else byCategory[catName].expense += t.amount;
        });

        // Summary
        const totalIncome = transactions
            .filter((t) => t.type === "income")
            .reduce((sum, t) => sum + t.amount, 0);
        const totalExpense = transactions
            .filter((t) => t.type === "expense")
            .reduce((sum, t) => sum + t.amount, 0);

        res.status(200).json({
            success: true,
            data: {
                summary: {
                    totalIncome,
                    totalExpense,
                    netCashflow: totalIncome - totalExpense,
                    transactionCount: transactions.length,
                },
                byCategory,
                periodStart: start,
                periodEnd: end,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Export transactions to CSV
export const exportTransactions = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { startDate, endDate, format = "csv" } = req.query;

        const transactions = await Transaction.find({
            user: userId,
            date: { $gte: new Date(startDate), $lte: new Date(endDate) },
        })
            .populate("category account")
            .lean();

        if (format === "csv") {
            const csv = [
                "Date,Type,Amount,Currency,Category,Account,Vendor,Description,Status",
                ...transactions.map(
                    (t) =>
                        `${t.date},${t.type},${t.amount},${t.currency},${t.category.name},${t.account.name},${t.vendor || ""},${t.description},${t.status}`
                ),
            ].join("\n");

            res.setHeader("Content-Type", "text/csv");
            res.setHeader(
                "Content-Disposition",
                `attachment; filename="transactions-${Date.now()}.csv"`
            );
            res.send(csv);
        } else {
            res.status(200).json({
                success: true,
                data: transactions,
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
