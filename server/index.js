import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db.js";
import Expense from "./models/expenseModel.js";

const app = express();
dotenv.config();

// Connect to database
connectDB();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
console.log("express.json middleware loaded");

app.use(express.urlencoded({ extended: false }));
console.log("express.urlencoded middleware loaded");


const PORT = process.env.PORT || 8000;

app.get("/api/expenses", async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.status(200).json({ success: true, data: expenses });
  } catch (error) {
    console.log("Error fetching expenses: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

app.post("/api/expenses", async (req, res) => {
  const newExpense = new Expense(req.body);
  console.log("Request Body:", req.body);
  try {
    const savedExpense = await newExpense.save();
    res.status(201).json({ success: true, data: savedExpense });
  } catch (error) {
    console.log("Error creating expenses: ", error.message);
    res.status(400).json({ success: false, message: "Error adding expense" });
  }
});

app.post("/test", (req, res) => {
  console.log("Received Body:", req.body);
  res.json({ receivedBody: req.body });
});


app.get("/dashboard", (req, res) => {
  res.send("Expense tracker dashboard");
});

app.listen(PORT, (error) => {
  console.log(`Server running on http://localhost:${PORT}`);
});
