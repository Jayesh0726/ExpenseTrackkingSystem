import express from "express";
const {handleCreateExpense, handleGetExpense} = require('../controllers/expense')
const router = express.Router();

// Add a new expense
router.post("/", handleCreateExpense);

// Get all expenses
router.get("/", handleGetExpense);

export default router;
