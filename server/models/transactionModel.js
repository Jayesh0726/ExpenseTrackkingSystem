import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    transactionId: {
        type: String,
        unique: true,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    type: {
        type: String,
        enum: ["income", "expense", "transfer"],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        default: "Rupees",
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: true,
    },
    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        default: null,
    },
    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        default: null,
    },
    vendor: {
        type: String,
        default: null,
    },
    description: {
        type: String,
        required: true,
    },
    tags: [String],
    date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected", "completed"],
        default: "completed",
    },
    attachments: [
        {
            url: String,
            fileName: String,
            uploadedAt: Date,
        },
    ],
    splits: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            amount: Number,
            status: {
                type: String,
                enum: ["pending", "approved"],
                default: "pending",
            },
        },
    ],
    recurring: {
        isRecurring: {
            type: Boolean,
            default: false,
        },
        frequency: {
            type: String,
            enum: ["daily", "weekly", "biweekly", "monthly", "quarterly", "yearly"],
            default: null,
        },
        endDate: {
            type: Date,
            default: null,
        },
        parentTransactionId: {
            type: String,
            default: null,
        },
    },
    notes: {
        type: String,
        default: null,
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    approvedAt: {
        type: Date,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
    deletedAt: {
        type: Date,
        default: null,
    },
});

// Index for performance
transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, category: 1, date: -1 });
transactionSchema.index({ user: 1, account: 1, date: -1 });

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
