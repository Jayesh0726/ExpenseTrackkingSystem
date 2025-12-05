import express from "express";
import {
    createBudget,
    getBudgets,
    getBudget,
    updateBudget,
    deleteBudget,
    getBudgetStatus,
    resetBudgetSpent,
} from "../controllers/budgetController.js";
import { authenticate, authorize } from "../middleware/rbac.js";

const router = express.Router();

// All budget routes require authentication
router.use(authenticate);

// Create budget (requires write permission)
router.post("/", authorize(["write"]), createBudget);

// Get all budgets
router.get("/", getBudgets);

// Get budget status for specific category
router.get("/status/:categoryId", getBudgetStatus);

// Get single budget
router.get("/:id", getBudget);

// Update budget (requires write permission)
router.put("/:id", authorize(["write"]), updateBudget);

// Reset budget spent (for new period)
router.post("/:id/reset", authorize(["write"]), resetBudgetSpent);

// Delete budget (requires delete permission)
router.delete("/:id", authorize(["delete"]), deleteBudget);

export default router;
