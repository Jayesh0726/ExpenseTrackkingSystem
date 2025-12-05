import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
    budgetId: {
        type: String,
        unique: true,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    period: {
        type: String,
        enum: ["daily", "weekly", "monthly", "quarterly", "yearly"],
        default: "monthly",
    },
    limit: {
        type: Number,
        required: true,
    },
    spent: {
        type: Number,
        default: 0,
    },
    currency: {
        type: String,
        default: "USD",
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    alertThreshold: {
        type: Number,
        default: 80,
    },
    alertSent: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
});

const Budget = mongoose.model("Budget", budgetSchema);
export default Budget;
