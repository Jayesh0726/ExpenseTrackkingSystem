import express from "express";
import {
    handleCreatingCategory,
    handleGettingCategory,
    handleGetCategory,
    handleUpdateCategory,
    handleDeleteCategory,
} from '../controllers/category.js';
import { authenticate, authorize } from "../middleware/rbac.js";

const router = express.Router();

// All category routes require authentication
router.use(authenticate);

// Create a new category
router.post("/", authorize(["write"]), handleCreatingCategory);

// Get all categories
router.get("/", handleGettingCategory);

// Get single category
router.get("/:id", handleGetCategory);

// Update category
router.put("/:id", authorize(["write"]), handleUpdateCategory);

// Delete category
router.delete("/:id", authorize(["delete"]), handleDeleteCategory);

export default router;
