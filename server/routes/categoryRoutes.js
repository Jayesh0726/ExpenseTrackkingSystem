import express from "express";
const {handleCreatingCategory, handleGettingCategory} = require('../controllers/category')
const router = express.Router();

// Create a new category
router.post("/", handleCreatingCategory);

// Get all categories
router.get("/", handleGettingCategory);

export default router;
