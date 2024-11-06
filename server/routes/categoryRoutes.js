import express from "express";
import Category from "../models/categoryModel.js";

const router = express.Router();

// Create a new category
router.post("/", async (req, res) => {
  try {
    const newCategory = new Category(req.body);
    const savedCategory = await newCategory.save();
    res.status(201).json({ success: true, data: savedCategory });
  } catch (error) {
    console.error("Error creating category:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

export default router;
