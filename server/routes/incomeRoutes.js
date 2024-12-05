import express from "express";
const {handleCreateIncome, handleGetIncome} = require('../controllers/income');
const router = express.Router();

// Add a new income entry
router.post("/", handleCreateIncome);

// Get all income entries
router.get("/", handleGetIncome);

export default router;
