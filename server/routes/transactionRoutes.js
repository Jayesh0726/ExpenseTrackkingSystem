import express from "express";
import {
    createTransaction,
    getTransactions,
    getTransaction,
    updateTransaction,
    deleteTransaction,
    approveTransaction,
} from "../controllers/transactionController.js";
import { authenticate, authorize } from "../middleware/rbac.js";

const router = express.Router();

// All transaction routes require authentication
router.use(authenticate);

// Create transaction (requires write permission)
router.post("/", authorize(["write"]), createTransaction);

// Get all transactions
router.get("/", getTransactions);

// Get single transaction
router.get("/:id", getTransaction);

// Update transaction (requires write permission)
router.put("/:id", authorize(["write"]), updateTransaction);

// Delete transaction (requires delete permission)
router.delete("/:id", authorize(["delete"]), deleteTransaction);

// Approve transaction (requires approve permission)
router.post("/:id/approve", authorize(["approve"]), approveTransaction);

export default router;
