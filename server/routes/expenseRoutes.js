import express from "express";
import {handleCreateExpense, handleGetExpense} from '../controllers/expense.js';
const router = express.Router();

// Add a new expense
router.post("/", handleCreateExpense);

// Get all expenses
router.get("/", handleGetExpense);

export default router;
