import express from "express";
import {
    handleCreateIncome,
    handleGetIncome,
    handleGetIncomeById,
    handleUpdateIncome,
    handleDeleteIncome,
} from '../controllers/income.js';
import { authenticate, authorize } from "../middleware/rbac.js";

const router = express.Router();

// All income routes require authentication
router.use(authenticate);

// Add a new income entry
router.post("/", authorize(["write"]), handleCreateIncome);

// Get all income entries
router.get("/", handleGetIncome);

// Get single income
router.get("/:id", handleGetIncomeById);

// Update income
router.put("/:id", authorize(["write"]), handleUpdateIncome);

// Delete income
router.delete("/:id", authorize(["delete"]), handleDeleteIncome);

export default router;
