import express from "express";
import Expense from "../models/expenseModel.js";

const router = express.Router();

// Add a new expense
router.post("/", async (req, res) => {
  try {
    const newExpense = new Expense(req.body);
    const savedExpense = await newExpense.save();
    res.status(201).json({ success: true, data: savedExpense });
  } catch (error) {
    console.error("Error adding expense:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get all expenses
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find()
      .populate("category", "name")
      .populate("user", "username");
    res.status(200).json({ success: true, data: expenses });
  } catch (error) {
    console.error("Error fetching expenses:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

export default router;
