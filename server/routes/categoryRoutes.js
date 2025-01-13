import express from "express";
import {handleCreatingCategory, handleGettingCategory} from '../controllers/category.js';
const router = express.Router();

// Create a new category
router.post("/", handleCreatingCategory);

// Get all categories
router.get("/", handleGettingCategory);

export default router;
