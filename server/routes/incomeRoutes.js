import express from "express";
import Income from "../models/IncomeModel.js";

const router = express.Router();

// Add a new income entry
router.post("/", async (req, res) => {
  try {
    const newIncome = new Income(req.body);
    const savedIncome = await newIncome.save();
    res.status(201).json({ success: true, data: savedIncome });
  } catch (error) {
    console.error("Error adding income:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get all income entries
router.get("/", async (req, res) => {
  try {
    const incomes = await Income.find()
      .populate("category", "name")
      .populate("user", "username");
    res.status(200).json({ success: true, data: incomes });
  } catch (error) {
    console.error("Error fetching incomes:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

export default router;
