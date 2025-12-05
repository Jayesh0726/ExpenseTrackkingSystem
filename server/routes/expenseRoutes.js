import express from "express";
import {
    handleCreateExpense,
    handleGetExpense,
    handleGetExpenseById,
    handleUpdateExpense,
    handleDeleteExpense,
} from '../controllers/expense.js';
import { authenticate, authorize } from "../middleware/rbac.js";

const router = express.Router();

// All expense routes require authentication
router.use(authenticate);

// Add a new expense
router.post("/", authorize(["write"]), handleCreateExpense);

// Get all expenses
router.get("/", handleGetExpense);

// Get single expense
router.get("/:id", handleGetExpenseById);

// Update expense
router.put("/:id", authorize(["write"]), handleUpdateExpense);

// Delete expense
router.delete("/:id", authorize(["delete"]), handleDeleteExpense);

export default router;
