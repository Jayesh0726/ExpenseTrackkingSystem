import express from "express";
import {handleCreateIncome, handleGetIncome} from '../controllers/income.js';
const router = express.Router();

// Add a new income entry
router.post("/", handleCreateIncome);

// Get all income entries
router.get("/", handleGetIncome);

export default router;
