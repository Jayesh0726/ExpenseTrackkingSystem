import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db.js";
import redis from "./config/redis.js";

import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import incomeRoutes from "./routes/incomeRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

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

// Use routes
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/incomes", incomeRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/dashboard", (req, res) => {
  res.send("Expense tracker dashboard");
});

app.listen(PORT, (error) => {
  console.log(`Server running on http://localhost:${PORT}`);
});
